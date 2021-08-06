<template>
  <v-menu
    :close-on-content-click="false"
    offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        bordered
        :color="menuColor"
        :content="alerts.length"
        overlap>
        <v-btn
          tile
          :color="menuColor"
          v-bind="attrs"
          v-on="on">
          <v-icon left>
            mdi-alert
          </v-icon>
          Show alerts.
        </v-btn>
      </v-badge>
    </template>
    <v-card class="pa-5">
      <v-card-title>Alerts list</v-card-title>
      <v-expansion-panels>
        <v-expansion-panel v-if="criticalAlerts.length > 0">
          <v-expansion-panel-header>
            Critical alerts({{criticalAlerts.length}})
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ul>
              <li
                v-bind:key="`critical${index}`"
              v-for="(alert,index) in criticalAlerts">
                <v-icon>{{icons[alert.type]}}</v-icon>
                {{alert.type}}: {{alert.message}}
              </li>
            </ul>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="warningAlerts.length > 0">
          <v-expansion-panel-header>
            Warning alerts({{warningAlerts.length}})
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ul>
              <li
                v-bind:key="`warning${index}`"
                v-for="(alert,index) in warningAlerts">
                <v-icon>{{icons[alert.type]}}</v-icon>
                {{alert.type}}: {{alert.message}}
              </li>
            </ul>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-menu>
</template>

<script>
import alertConfig from '@/assets/alert.config.json';

export default {
  name: 'AlertMenu',
  computed: {
    icons() {
      return alertConfig.icon;
    },
    alerts() {
      return this.$store.state.alerts;
    },
    menuColor() {
      return this.$store.state.alerts.some((alert) => alert.severity === 'critical')
        ? alertConfig.color.critical
        : alertConfig.color.warning;
    },
    criticalAlerts() {
      return this.$store.state.alerts.filter((alert) => alert.severity === 'critical');
    },
    warningAlerts() {
      return this.$store.state.alerts.filter((alert) => alert.severity === 'warning');
    },
  },
};
</script>
