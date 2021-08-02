<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="project in projects"
        :key="project">
        <project-card
          :name="project"
          :class="projectColors[project]"
          :is-master-project="true"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue';
import projectColors from '@/assets/project.color.json';

export default {
  name: 'MasterProjectCardList',
  components: { ProjectCard },
  data() {
    return {
      projectColors,
      projects: ['Harmony', 'Karajan', 'Workflow'],
    };
  },
};
</script>
