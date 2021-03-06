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
        <router-view></router-view>
        <action-menu v-if="isAdministrator()"/>
      </v-container>
    </v-main>
    <application-footer/>
    <application-dialog/>
  </v-app>
</template>

<script>
import ApplicationBar from '@/components/commons/ApplicationBar.vue';
import NavigationItems from '@/components/commons/NavigationItems.vue';
import ApplicationFooter from '@/components/commons/ApplicationFooter.vue';
import ApplicationSnackbar from '@/components/commons/ApplicationSnackbar.vue';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import ActionMenu from './components/ActionMenu.vue';
import ApplicationDialog from './components/commons/ApplicationDialog.vue';
import DialogMixin from './mixins/DialogMixin';

export default {
  name: 'app',
  components: {
    ApplicationDialog,
    ActionMenu,
    ApplicationSnackbar,
    ApplicationFooter,
    NavigationItems,
    ApplicationBar,
  },
  mixins: [AuthenticationMixin, DialogMixin],
  mounted() {
    this.$http.get('/octo-spy/api/info')
      .then((response) => {
        this.version.api = response.data.version;
      });
    this.$http.get('/changelog.json')
      .then((response) => {
        this.manageVersions(window.localStorage, response.data);
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
  methods: {
    manageVersions(storage, versions) {
      const currentVersion = storage.getItem('last-version');
      const unreadVersions = [];
      versions.some((data) => {
        if (data.version === currentVersion) {
          return true;
        }
        unreadVersions.push(data);
        return false;
      });
      if (unreadVersions.length > 0) {
        storage.setItem('last-version', unreadVersions[0].version);
        this.openDialog('newVersionsCard', unreadVersions);
      }
    },
  },
};
</script>

<style lang="scss">
.v-navigation-drawer {
  will-change: initial;
}
</style>
