<template>
  <v-app>
    <v-card height="56px">
      <v-bottom-nav
        :active.sync="bottomNav"
        :color="color"
        :value="true"
        absolute
        dark
        shift
        
      >
  <router-link :to="item.link" v-for="item in menu">
        <v-btn dark>
          <span>{{item.title}}</span>
          <v-icon>{{item.icon}}</v-icon>
        </v-btn>
        </router-link>
      </v-bottom-nav>
    </v-card>
    <!-- <v-toolbar app>
      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <v-toolbar-side-icon></v-toolbar-side-icon>
          </v-toolbar-title>
        </template>
        <v-list v-for="item in menu">
          <router-link :to="item.link">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </router-link>
        </v-list>
      </v-menu>
    </v-toolbar> -->

    <v-content>
      <router-view>
        <!-- Route content goes here. -->
      </router-view>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  data() {
    return {
      menu: [{
        link: "/barChart",
        icon: "bar_chart",
        title: "Bar Chart"
      },
      {
        link: "/lineChart",
        icon: "show_chart",
        title: "Line Chart"
      },
      {
        link: "/donutChart",
        icon: "donut_large",
        title: "Donut Chart"
      },
      {
        link: "/chartBars",
        icon: "bar_chart",
        title: " Chart Bar"
      },
      {
        link: "/chartLines",
        icon: "show_chart",
        title: " Chart Line"
      },
      {
        link: "/chartDonut",
        icon: "donut_large",
        title: " Chart Donut"
      }
      ],
      bottomNav: 3
    };
  },
  computed: {
    color () {
      switch (this.bottomNav) {
        case 0: return 'blue-grey'
        case 1: return 'teal'
        case 2: return 'brown'
        case 3: return 'indigo'
      }
    }
  }
};
</script>
<style scoped>
a {
  color: black;
  text-decoration: none;
}
</style>