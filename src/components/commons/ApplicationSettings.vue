<template>
  <v-expansion-panels>
    <v-expansion-panel
      :key="`component${index}`"
      v-for="(setting, index) in settings">
      <v-expansion-panel-header>
        <div>
          <v-icon left>{{ setting.icon }}</v-icon>
          {{ setting.name }}
        </div>
      </v-expansion-panel-header>
      <component :is="setting.component"/>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import AdministratorSettings from '@/components/AdministratorSettings.vue';
import TokenManagementPanel from '@/components/TokenManagementPanel.vue';

export default {
  name: 'ApplicationSettings',
  components: { AdministratorSettings },
  data() {
    return {
      settings: [{
        name: 'Administrator account.',
        icon: 'mdi-shield-account',
        component: AdministratorSettings,
      }, {
        name: 'Token management.',
        icon: 'mdi-shield-key',
        component: TokenManagementPanel,
      }],
    };
  },
};
</script>
