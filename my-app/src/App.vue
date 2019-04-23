<template>
  <v-app>
    <v-toolbar app>
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
    </v-toolbar>

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
      }]
    };
  }
};
</script>
<style scoped>
a {
  color: black;
  text-decoration: none;
}
</style>