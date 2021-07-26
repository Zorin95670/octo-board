<template>
  <v-card align="center" justify="center">
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text v-if="displaySubProjects">
      <v-container fluid v-if="subProjectsLoading">
        <v-progress-circular indeterminate/>
        Loading total of sub-projects.
      </v-container>
      <v-container fluid v-else>
        {{ total }} sub-projects.
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="ma-0 pa-0" style="justify-content: center">
      <v-btn
        icon
        title="See sub-projects."
        v-if="isMasterProject"
        :to="`/projects/${this.name}`"
        :disabled="subProjectsLoading || total === 0">
        <v-icon>mdi-archive</v-icon>
      </v-btn>
      <v-btn icon title="Associated jira issues.">
        <v-icon>mdi-jira</v-icon>
      </v-btn>
      <v-btn icon title="Project settings.">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    name: String,
    isMasterProject: {
      type: Boolean,
      default: false,
    },
    displaySubProjects: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    if (!this.isMasterProject) {
      return;
    }
    this.$http.get('/octo-spy/api/project/count', {
      params: {
        field: 'masterProject',
        masterProject: this.name,
        name: `not_${this.name}`,
      },
    }).then((response) => {
      this.subProjectsLoading = false;
      this.total = response.data[this.name] || 0;
    });
  },
  data() {
    return {
      total: 0,
      subProjectsLoading: true,
    };
  },
};
</script>

<style scoped>

</style>
