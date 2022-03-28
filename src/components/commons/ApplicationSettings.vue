<template>
  <v-expansion-panels v-model="anchor">
    <v-expansion-panel
      :key="`component${index}`"
      v-for="(setting, index) in settings">
      <v-expansion-panel-header>
        <div>
          <v-icon left>{{ setting.icon }}</v-icon>
          {{ setting.name }}
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <component :is="setting.component"/>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import AdministratorSettings from '@/components/AdministratorSettings.vue';
import DashboardManagementPanel from '../DashboardManagementPanel.vue';
import EnvironmentSettings from '@/components/EnvironmentSettings.vue';
import TokenManagementPanel from '@/components/TokenManagementPanel.vue';

export default {
  name: 'ApplicationSettings',
  watch: {
    anchor() {
      if (this.anchor === undefined) {
        this.$router.replace('/settings');
      } else {
        this.$router.replace(`/settings/${this.settings[this.anchor].key}`);
      }
    },
  },
  data() {
    const settings = [{
      key: 'dashboard',
      name: 'Dashboard management.',
      icon: 'mdi-view-dashboard',
      component: DashboardManagementPanel,
    }, {
      key: 'environment',
      name: 'Environment management.',
      icon: 'mdi-server',
      component: EnvironmentSettings,
    }, {
      key: 'administrator',
      name: 'Administrator account.',
      icon: 'mdi-shield-account',
      component: AdministratorSettings,
    }, {
      key: 'token',
      name: 'Token management.',
      icon: 'mdi-shield-key',
      component: TokenManagementPanel,
    }];
    return {
      anchor: this.getAnchorIndex(settings),
      settings,
    };
  },
  methods: {
    getAnchorIndex(settings) {
      if (!this.$route.params.anchor) {
        return null;
      }
      return settings.map((setting) => setting.key)
        .indexOf(this.$route.params.anchor);
    },
  },
};
</script>
