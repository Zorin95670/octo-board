<template>
  <div>
    <div class="d-flex justify-center mb-5">
      <v-btn
        color="red"
        @click="openConfirmationDialog(name, true)">
        <v-icon>mdi-delete</v-icon>
        Delete master project
      </v-btn>
    </div>
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Undeploy projects({{ undeployProjects.length }})
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-flex justify-center">
            <template v-if="undeployProjects.length === 0">
              All projects are deployed.
            </template>
            <template v-else-if="isAdministrator()">
              <v-btn
                color="red"
                class="ma-2 text-none"
                @click="openConfirmationDialog(project)"
                v-bind:key="project"
                v-for="project in undeployProjects">
                <v-icon>mdi-delete</v-icon>
                {{ project }}
              </v-btn>
            </template>
            <template v-else>
              <v-chip
                class="ma-2"
                v-bind:key="project"
                v-for="project in undeployProjects">
                {{ project }}
              </v-chip>
            </template>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Deploy projects({{ deployProjects.length }})
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <deployment-table :master-project="name"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import DeploymentTable from '@/components/DeploymentTable.vue';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import DialogMixin from '@/mixins/DialogMixin';

export default {
  name: 'SubProjectsTable',
  components: { DeploymentTable },
  mixins: [AuthenticationMixin, DialogMixin],
  computed: {
    name() {
      return this.$route.params.masterProjectName;
    },
  },
  data() {
    return {
      undeployProjects: [],
      deployProjects: [],
      projects: [],
    };
  },
  created() {
    this.loadProjects();
    this.$root.$on('reloadSubProject', (name) => {
      if (name === this.name) {
        this.loadProjects();
      }
    });
    this.$root.$on('deleteProject', this.deleteProject);
  },
  beforeDestroy() {
    this.$root.$off('reloadSubProject');
    this.$root.$off('deleteProject', this.deleteProject);
  },
  methods: {
    loadProjects() {
      return Promise.allSettled([
        this.$http.get('/octo-spy/api/projects', {
          params: {
            masterProject: this.name,
          },
        }),
        this.$http.get('/octo-spy/api/deployments/count', {
          params: {
            masterProject: this.name,
            project: `not_${this.name}`,
            field: 'project',
          },
        }),
      ])
        .then((response) => {
          this.undeployProjects = [];
          this.deployProjects = [];
          this.projects = response[0].value.data.content;

          const count = response[1].value.data;

          this.projects
            .filter((project) => !project.isMaster)
            .map((project) => project.name)
            .forEach((project) => {
              if (Object.prototype.hasOwnProperty.call(count, project)) {
                this.deployProjects.push(project);
              } else {
                this.undeployProjects.push(project);
              }
            });
          return response;
        });
    },
    openConfirmationDialog(name, isMaster = false) {
      const title = `Delete project ${name} ?`;
      const masterText = isMaster ? 'and sub-projects' : '';
      const disclaimer = `<br/><br/>This will delete all associated deployments ${masterText}!`;
      this.openDialog('confirmationCard', {
        text: `${title}${disclaimer}`,
        event: 'deleteProject',
        eventData: name,
      });
    },
    deleteProject(name) {
      const project = this.projects.find((p) => p.name === name);

      return this.$http.delete(`/octo-spy/api/projects/${project.id}`, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          if (project.isMaster) {
            this.$router.push('/projects');
            return Promise.resolve();
          }
          return this.loadProjects();
        });
    },
  },
};
</script>
