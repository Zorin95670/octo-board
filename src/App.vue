<template>
  <v-app>
    <application-snackbar/>
    <v-navigation-drawer
      app
      v-model="drawer"
      absolute
      temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Octo-board
          </v-list-item-title>
          <v-list-item-subtitle>
            Centralize project's versions
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <navigation-items/>
    </v-navigation-drawer>
    <application-bar @openNavigationPanel="drawer = !drawer"/>

    <v-main>
      <v-container fluid>
        <v-breadcrumbs divider=">"></v-breadcrumbs>
        <router-view></router-view>
      </v-container>
    </v-main>
    <application-footer/>
  </v-app>
</template>

<script>
import ApplicationBar from '@/components/commons/ApplicationBar.vue';
import NavigationItems from '@/components/commons/NavigationItems.vue';
import ApplicationFooter from '@/components/commons/ApplicationFooter.vue';
import ApplicationSnackbar from '@/components/commons/ApplicationSnackbar.vue';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'app',
  components: {
    ApplicationSnackbar,
    ApplicationFooter,
    NavigationItems,
    ApplicationBar,
  },
  mixins: [AuthenticationMixin],
  mounted() {
    this.$http.get('/octo-spy/api/info').then((response) => {
      this.version.api = response.data.version;
    });

    this.authenticateFromStorage(window.localStorage);
  },
  data() {
    return {
      drawer: false,
      version: {
        gui: this.$root.version,
        api: '-',
      },
    };
  },
};
</script>

<style lang="scss">
.v-navigation-drawer {
  will-change: initial;
}
</style>
