<template>
  <v-app>
    <v-toolbar app>
      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <v-toolbar-side-icon></v-toolbar-side-icon>
          </v-toolbar-title>
        </template>
        <v-list>
        <router-link to="/barChart">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>bar_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Bar chart</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
</v-list>
        <!-- <v-list>
          <v-list-tile v-for="item in items" :key="item" @click>
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list> -->
      </v-menu>
    </v-toolbar>

    <v-content>
      <router-view v-show="!globalLoader">
        <!-- Route content goes here. -->
      </router-view>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  // components: {
  //   HelloWorld
  // },
  data() {
    return {
      items: ["All", "Family", "Friends", "Coworkers"]
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