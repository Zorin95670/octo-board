<template>
  <v-menu
    top
    v-model="isOpen"
    origin="center center"
    :offset-y="true"
    transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-fab-transition>
        <v-btn
          v-show="hasAction"
          v-bind="attrs"
          v-on="on"
          :color="isOpen ? 'dark-grey' : 'green'"
          dark
          fixed
          bottom
          right
          fab
          style="bottom: 130px;">
          <v-icon>
            {{ isOpen ? 'mdi-minus': 'mdi-plus' }}
          </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <v-list
      dense
      nav>
      <v-list-item
        @click="openDialog(action.component, action.config)"
        v-bind:key="action.key"
        v-for="action in actions">
        <v-list-item-icon>
          <v-icon>{{ action.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ action.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import DialogMixin from '@/mixins/DialogMixin';
import ActionDefinitions from '@/assets/menu.actions.json';

export default {
  name: 'ActionMenu',
  mixins: [AuthenticationMixin, DialogMixin],
  data() {
    return {
      isOpen: false,
      hasAction: false,
      actionColor: null,
      actionIcon: null,
      actions: [],
    };
  },
  created() {
    this.initData(this.$router.currentRoute.meta);
  },
  watch: {
    $route(to) {
      this.initData(to.meta);
    },
  },
  methods: {
    initData(meta) {
      this.hasAction = meta.hasAction;
      if (this.hasAction) {
        this.actionColor = meta.actionColor;
        this.actionIcon = meta.actionIcon;
        this.actions = meta.actions
          .map((name) => ({
            ...ActionDefinitions[name],
            key: name,
          }));
      } else {
        this.actionColor = null;
        this.actionIcon = null;
        this.actions = [];
      }
    },
  },
};
</script>
