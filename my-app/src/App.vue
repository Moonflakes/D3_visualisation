<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent fixed clipped class="grey lighten-4" app v-model="drawer">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-layout row v-if="item.heading" align-center :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider dark v-else-if="item.divider" class="my-3" :key="i"></v-divider>
          <v-list-tile :key="i" v-else @click>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar  app absolute clipped-left style="height: 54px;">
      <!-- <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-bottom-nav :active.sync="bottomNav" :color="color" :value="true" absolute dark shift>
        <router-link :to="item.link" v-for="item in menu">
          <v-btn dark>
            <span>{{item.title}}</span>
            <v-icon>{{item.icon}}</v-icon>
          </v-btn>
        </router-link>
      </v-bottom-nav>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        <v-layout justify-center align-center>
          <v-flex shrink>
            <router-view>
              <!-- Route content goes here. -->
             </router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <!-- <v-card height="56px">
      <v-bottom-nav :active.sync="bottomNav" :color="color" :value="true" absolute dark shift>
        <router-link :to="item.link" v-for="item in menu">
          <v-btn dark>
            <span>{{item.title}}</span>
            <v-icon>{{item.icon}}</v-icon>
          </v-btn>
        </router-link>
      </v-bottom-nav>
    </v-card>-->
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
    </v-toolbar>-->

    <!-- <v-content >
      <router-view>
        Route content goes here.
      </router-view>
    </v-content>-->
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  data() {
    return {
      menu: [
        {
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
      bottomNav: 3,
      drawer: null,
      items: [
        { icon: "lightbulb_outline", text: "Notes" },
        { icon: "touch_app", text: "Reminders" },
        { divider: true },
        { heading: "Labels" },
        { icon: "add", text: "Create new label" },
        { divider: true },
        { icon: "archive", text: "Archive" },
        { icon: "delete", text: "Trash" },
        { divider: true },
        { icon: "settings", text: "Settings" },
        { icon: "chat_bubble", text: "Trash" },
        { icon: "help", text: "Help" },
        { icon: "phonelink", text: "App downloads" },
        { icon: "keyboard", text: "Keyboard shortcuts" }
      ]
    };
  },
  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "purple";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
        case 4:
          return "pink";
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

#keep main .container {
    height: 660px;
  }

  .navigation-drawer__border {
    display: none;
  }

  .text {
    font-weight: 400;
  }
</style>