<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ firstname }} {{ lastname }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-content>
        <v-btn
          tile
          color="error"
          @click="exit">
          <v-icon left>
            mdi-logout
          </v-icon>
          Logout
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'UserSettingsPanel',
  mixins: [AuthenticationMixin],
  computed: {
    firstname() {
      return this.$store.state.user.firstname;
    },
    lastname() {
      return this.$store.state.user.lastname;
    },
    email() {
      return this.$store.state.user.email;
    },
  },
  methods: {
    exit() {
      this.disconnect(window.localStorage);
    },
  },
};
</script>
