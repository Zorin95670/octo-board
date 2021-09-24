<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="project in projects"
        :key="project.name">
        <project-card
          :name="project.name"
          :project-id="project.id"
          :color="project.color"
          :default-color="project.color"
          :is-master-project="true"
          @onProjectUpdate="onProjectUpdate"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue';

export default {
  name: 'MasterProjectCardList',
  components: { ProjectCard },
  data() {
    return {
      projects: [],
    };
  },
  created() {
    this.loadProjects();
    this.$root.$on('reloadMasterProject', this.loadProjects);
  },
  beforeDestroy() {
    this.$root.$off('reloadMasterProject', this.loadProjects);
  },
  methods: {
    loadProjects() {
      return this.$http.get('/octo-spy/api/project?isMaster=true').then((response) => {
        this.projects = response.data;
      });
    },
    onProjectUpdate() {
      return this.loadProjects();
    },
  },
};
</script>
