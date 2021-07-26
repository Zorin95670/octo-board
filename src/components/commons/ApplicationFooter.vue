<template>
  <v-footer app fixed padless>
    <v-card
      flat
      tile
      width="100%"
      class="text-center">
      <v-card-text>
        <v-btn
          icon
          link
          target="_blank"
          title="See application changelog"
          href="/changelog.html">
          <v-icon>mdi-math-log</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        Octo board {{ version.gui }} - Octo spy {{ version.api }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'ApplicationFooter',
  mounted() {
    this.$http.get('/octo-spy/api/info').then((response) => {
      this.version.api = response.data.version;
    });
  },
  data() {
    return {
      icons: [],
      version: {
        gui: this.$root.version,
        api: '-',
      },
    };
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
