<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      @click.stop="$emit('openNavigationPanel')"/>
    <v-toolbar-title>
      Octo board - {{ renderString($route.name, $route.params) }}
    </v-toolbar-title>

    <v-spacer/>
    <alert-menu v-if="isAdministrator() && hasAlerts"/>
    <v-spacer/>
    <!-- open-on-hover -->
    <v-menu
      :close-on-content-click="false"
      offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          size="36px"
          v-bind="attrs"
          v-on="on">
          <v-icon
            large
            color="error"
            v-if="login === 'admin'">mdi-account-tie</v-icon>
          <identicon
            :value="login"
            :size="36"
            v-else-if="isConnected"/>
          <v-icon large v-else>mdi-account-circle</v-icon>
        </v-avatar>
      </template>
      <v-card class="pa-5">
        <authentication-panel v-if="!isConnected"/>
        <user-settings-panel v-else/>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import NunjucksMixin from '@/mixins/NunjucksMixin';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import Identicon from '@/components/commons/Identicon.vue';
import AuthenticationPanel from '@/components/AuthenticationPanel.vue';
import UserSettingsPanel from '@/components/UserSettingsPanel.vue';
import AlertMenu from '@/components/commons/AlertMenu.vue';

export default {
  name: 'ApplicationBar',
  components: {
    AlertMenu,
    UserSettingsPanel,
    AuthenticationPanel,
    Identicon,
  },
  mixins: [AuthenticationMixin, NunjucksMixin],
  computed: {
    hasAlerts() {
      return this.$store.state.alerts.length > 0;
    },
    login() {
      return this.$store.state.user.login;
    },
  },
};
</script>
