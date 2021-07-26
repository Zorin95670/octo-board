<template>
  <v-container fluid>
    <v-row justify="center" aligns="center">
      <v-col :cols="2" class="ma-0 pa-0"></v-col>
      <template v-for="(environment, index) in environments">
        <v-col
          class="ma-0 pa-0"
          :key="`${environment.name}`"
          :cols="environment.maxClients">
          <v-container fluid>
            <v-card align="center" justify="center">
              <v-card-text>{{ environment.name }}</v-card-text>
            </v-card>
          </v-container>
        </v-col>
        <v-divider
          :key="`${environment.name}-divider`"
          v-if="index < environments.length - 1" vertical/>
      </template>
    </v-row>
    <v-row
      justify="center" aligns="center"
      v-for="project in projects"
      :key="`${project}`">
      <v-col class="ma-0 pa-0" :cols="2">
        <v-container fluid>
          <project-card
            :name="project"
            :display-sub-projects="false"
            :is-master-project="masterProject === null"/>
        </v-container>
      </v-col>
      <template
        v-for="(environment, index) in environments">
        <v-col
          :cols="environment.clients[project].length === 1 ? environment.maxClients : 1"
          class="ma-0 pa-0"
          v-for="client in environment.clients[project]"
          :key="`${project}-${environment.name}-${client}`">
          <v-container fluid>
            <deployment-card
              :deployment="items[project][environment.name][client]"/>
          </v-container>
        </v-col>
        <v-col
          :cols="environment.maxClients - environment.clients[project].length"
          :key="`${project}-${environment.name}-none`"
          v-if="environment.maxClients - environment.clients[project].length > 0
          && environment.clients[project].length > 1">
          <v-card></v-card>
        </v-col>
        <v-divider
          :key="`${project}-${environment.name}-divider`"
          v-if="index < environments.length - 1" vertical/>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import DeploymentCard from '@/components/DeploymentCard.vue';
import ProjectCard from '@/components/ProjectCard.vue';
import projectColors from '@/assets/project.color.json';

export default {
  name: 'DeploymentTable',
  components: { ProjectCard, DeploymentCard },
  props: {
    masterProject: {
      type: String,
      default: null,
    },
  },
  created() {
    const params = { onMasterProject: true };
    if (this.masterProject !== null) {
      params.masterProject = this.masterProject;
      params.onMasterProject = false;
      params.name = `not_${this.masterProject}`;
    }
    this.$http.all([
      this.$http.get('/octo-spy/api/environment'),
      this.$http.get('/octo-spy/api/deployment/last', { params }),
    ]).then((values) => {
      const deployments = values[1].data;

      this.projects = [...new Set(deployments.map((deployment) => deployment.project))];

      values[0].data.forEach((env) => {
        const clients = {};
        this.projects.forEach((project) => {
          clients[project] = deployments.filter((deployment) => deployment.environment === env.name
            && deployment.project === project).map((deployment) => deployment.client);
        });
        const array = Object.keys(clients)
          .map((key) => clients[key].length);
        this.environments.push({
          name: env.name,
          clients,
          maxClients: Math.max(...array),
        });
      });

      this.items = deployments.reduce((acc, deployment) => {
        if (!acc[deployment.project]) {
          acc[deployment.project] = {};
        }
        if (!acc[deployment.project][deployment.environment]) {
          acc[deployment.project][deployment.environment] = {};
        }
        const color = this.projectColors[deployment.project];
        const index = this.environments.findIndex((env) => env.name === deployment.environment) + 1;
        acc[deployment.project][deployment.environment][deployment.client] = {
          ...deployment,
          color: `${color}  darken-${index}`,
        };
        return acc;
      }, {});
    });
  },
  data() {
    return {
      items: {},
      environments: [],
      projects: [],
      maxClients: {},
      projectColors,
    };
  },
};
</script>

<style scoped>

</style>
