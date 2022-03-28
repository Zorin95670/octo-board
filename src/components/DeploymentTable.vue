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
              <v-card-title
                class="text-no-wrap justify-center">
                {{ environment.name }}
              </v-card-title>
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
      :key="`${project.name}`">
      <v-col class="ma-0 pa-0 d-flex align-center" :cols="2">
        <v-container fluid>
          <project-card
            :name="project.name"
            :project-id="project.id"
            :display-sub-projects="false"
            :default-color="project.color"
            :is-master-project="project.isMaster"
            @onProjectUpdate="onProjectUpdate"/>
          {{project.onMasterProject}}
        </v-container>
      </v-col>
      <template
        v-for="(environment, index) in environments">
        <v-col
          :cols="environment.clients[project.name].length === 1 ? environment.maxClients : 1"
          class="ma-0 pa-0 d-flex align-center"
          v-for="client in environment.clients[project.name]"
          :key="`${project.name}-${environment.name}-${client}`">
          <v-container fluid>
            <deployment-card
              :deployment="items[project.name][environment.name][client]"/>
          </v-container>
        </v-col>
        <v-col
          :cols="environment.maxClients - environment.clients[project.name].length"
          :key="`${project}-${environment.name}-none`"
          v-if="(environment.maxClients - environment.clients[project.name].length > 0
          && environment.clients[project.name].length > 1)
          || environment.clients[project.name].length === 0">
          <v-card></v-card>
        </v-col>
        <v-divider
          :key="`${project.name}-${environment.name}-divider`"
          v-if="index < environments.length - 1" vertical/>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import DeploymentCard from '@/components/DeploymentCard.vue';
import ProjectCard from '@/components/ProjectCard.vue';

export default {
  name: 'DeploymentTable',
  components: {
    ProjectCard,
    DeploymentCard,
  },
  props: {
    parameters: Object,
  },
  watch: {
    parameters() {
      this.items = {};
      this.environments = [];
      this.projects = [];
      this.maxClients = {};
      this.load(this.parameters);
    },
  },
  created() {
    this.load(this.parameters);
  },
  data() {
    return {
      items: {},
      environments: [],
      projects: [],
      maxClients: {},
    };
  },
  methods: {
    onProjectUpdate() {
      return this.load(this.params);
    },
    load(params) {
      return this.$http.all([
        this.$http.get('/octo-spy/api/environments'),
        this.$http.get('/octo-spy/api/deployments/last?count=200', { params }),
      ])
        .then((values) => {
          const environmentNames = values[0].data.content;
          const deployments = values[1].data.content;

          this.projects = this.initProjects(deployments);
          this.environments = this.initEnvironments(
            this.projects,
            deployments,
            environmentNames,
          );
          this.items = this.initTableData(deployments, this.environments);
        });
    },
    initProjects(deployments) {
      return deployments.reduce((acc, deployment) => {
        if (!acc.some((project) => project.id === deployment.projectId)) {
          acc.push({
            id: deployment.projectId,
            name: deployment.project,
            color: deployment.color || '63,81,181',
            isMaster: deployment.onMasterProject,
          });
        }
        return acc;
      }, []);
    },
    initEnvironments(projects, deployments, environmentNames) {
      const environments = [];
      environmentNames.forEach((env) => {
        const clients = {};
        projects.forEach((project) => {
          clients[project.name] = deployments
            .filter((deployment) => deployment.environment === env.name
              && deployment.projectId === project.id)
            .map((deployment) => deployment.client)
            .sort();
        });
        const array = Object.keys(clients)
          .map((key) => clients[key].length);
        const max = Math.max(...array);
        this.maxClients[env.name] = max;

        if (max > 0) {
          environments.push({
            name: env.name,
            clients,
            maxClients: max,
          });
        }
      });
      return environments;
    },
    initTableData(deployments, environments) {
      return deployments.reduce((acc, deployment) => {
        if (!acc[deployment.project]) {
          acc[deployment.project] = {};
        }
        if (!acc[deployment.project][deployment.environment]) {
          acc[deployment.project][deployment.environment] = {};
        }
        const index = environments
          .findIndex((env) => env.name === deployment.environment) + 1;
        acc[deployment.project][deployment.environment][deployment.client] = {
          ...deployment,
          color: deployment.color || '63,81,181',
          colorIndex: index,
        };
        return acc;
      }, {});
    },
  },
};
</script>
