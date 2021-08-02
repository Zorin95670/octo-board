<template>
  <v-list
    dense
    nav>
    <template v-for="item in navigationItems">
      <v-list-item
        :key="item.text"
        :to="item.route"
        v-if="item.permitAll || isUserGranted(item.roles)"
        link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import navigationItems from '@/assets/navLinks.json';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'NavigationItems',
  mixins: [AuthenticationMixin],
  data() {
    return {
      navigationItems,
    };
  },
};
</script>
