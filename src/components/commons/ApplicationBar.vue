<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      @click.stop="$emit('openNavigationPanel')"/>
    <v-toolbar-title>
      Octo board - {{ renderString($route.name, $route.params) }}
    </v-toolbar-title>

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
          <v-icon large>mdi-account-circle</v-icon>
        </v-avatar>
      </template>
      <v-card class="pa-5">
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import NunjucksMixin from '@/mixins/NunjucksMixin';

export default {
  name: 'ApplicationBar',
  mixins: [NunjucksMixin],
};
</script>
