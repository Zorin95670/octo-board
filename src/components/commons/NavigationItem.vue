<template>
  <v-list-group dense no-action
    v-if="item.hasItems">
    <v-list-item slot='activator' style="padding: 0">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item>
    <v-list-item
      :to="`/dashboards/${dashboard.id}`"
      v-for='dashboard in dashboards'
      :key="`dashboard_link_${dashboard.id}`">
      <v-list-item-title>
        {{ dashboard.name }}
      </v-list-item-title>
    </v-list-item>
  </v-list-group>
  <v-list v-else>
    <v-list-item
      :key="item.key"
      :to="item.route"
      v-if="item.permitAll || isUserGranted(item.roles)"
      link>
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'NavigationItem',
  mixins: [AuthenticationMixin],
  props: {
    item: Object,
  },
  computed: {
    dashboards() {
      return this.$store.state.dashboard.items;
    },
  },
  methods: {
    changeVisibility(key) {
      this.isOpen[key] = !this.isOpen[key];
    },
  },
};
</script>
