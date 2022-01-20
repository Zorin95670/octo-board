<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-expansion-panels v-model="filtersPanel">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Report filter manager
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col class="d-flex align-center justify-center">
              <v-select
                class="d-inline-flex ma-5"
                style="max-width: 25rem;"
                v-model="selectedMasterProjects"
                :items="masterProjects"
                :menu-props="{ maxHeight: '400' }"
                item-text="name"
                item-value="id"
                label="Master projects"
                multiple
                hint="Select the master projects"
                persistent-hint
                :disabled="loading"
                @change="setMasterProjects"/>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <v-select
                class="d-inline-flex ma-5"
                style="max-width: 25rem;"
                v-model="selectedEnvironments"
                :items="environments"
                :menu-props="{ maxHeight: '400' }"
                item-text="name"
                item-value="id"
                label="Environment"
                multiple
                hint="Select the environments"
                persistent-hint
                :disabled="loading"
                @change="setEnvironments"/>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <v-select
                class="d-inline-flex ma-5"
                style="max-width: 25rem;"
                v-model="selectedClients"
                :items="clients"
                :menu-props="{ maxHeight: '400' }"
                label="Client"
                multiple
                hint="Select the clients"
                persistent-hint
                :disabled="loading"
                @change="setClients"/>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              class="d-inline-flex ma-5"
              color="success"
              @click="reloadCharts"
              :disabled="canReload">
              <v-icon left>mdi-sync</v-icon>
              Reload
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div>
      <v-chip-group class="ml-5">
        <template v-if="masterProjects.length === previousMasterProjects.length">
          <v-chip>Master project: all</v-chip>
        </template>
        <template v-else>
          <v-chip
            :key="`masterProject_${masterProject}`"
            v-for="masterProject in previousMasterProjects"
            close
            close-icon="mdi-close"
            @click.native.stop=""
            @click:close="removeMasterProject(masterProject)"
            :disabled="loading">
            Master project: {{ getMasterProjectName(masterProject) }}
          </v-chip>
        </template>
        <template v-if="environments.length === previousEnvironments.length">
          <v-chip>Environment: all</v-chip>
        </template>
        <template v-else>
          <v-chip
            :key="`environment_${environment}`"
            v-for="environment in previousEnvironments"
            close
            close-icon="mdi-close"
            @click.native.stop="null"
            @click:close="removeEnvironment(environment)"
            :disabled="loading">
            Environment: {{ getEnvironmentName(environment) }}
          </v-chip>
        </template>
        <template v-if="clients.length === previousClients.length">
          <v-chip>Client: all</v-chip>
        </template>
        <template v-else>
          <v-chip
            :key="`client_${client}`"
            v-for="client in previousClients"
            close
            close-icon="mdi-close"
            @click:close="removeClient(client)"
            :disabled="loading">
            Client: {{ client }}
          </v-chip>
        </template>
        <template v-if="resetVisibility">
          <v-chip
            color="error"
            @click.native.stop="resetFilters"
            :disabled="loading">
            Reset filters
          </v-chip>
        </template>
      </v-chip-group>
    </div>
    <div class="d-flex flex-row align-start justify-space-around ma-5">
      <week-deployment-report-card
        ref="weekDeploymentReport"
        :master-projects="masterProjects"
        :environments="environments"
        :clients="clients"
        :global-loading="loading"/>
    </div>
  </div>
</template>

<script>
import WeekDeploymentReportCard from '@/components/cards/report/WeekDeploymentReportCard.vue';

export default {
  name: 'ReportPanel',
  components: { WeekDeploymentReportCard },
  computed: {
    canReload() {
      return this.loading
        || (!this.isMasterProjectsChange
          && !this.isEnvironmentsChange
          && !this.isClientsChange);
    },
    resetVisibility() {
      return this.loading
        || this.masterProjects.length !== this.previousMasterProjects.length
        || this.environments.length !== this.previousEnvironments.length
        || this.clients.length !== this.previousClients.length;
    },
  },
  data() {
    return {
      filtersPanel: null,
      masterProjects: [],
      environments: [],
      clients: [],
      isMasterProjectsChange: false,
      isEnvironmentsChange: false,
      isClientsChange: false,
      selectedMasterProjects: [],
      selectedEnvironments: [],
      selectedClients: [],
      previousMasterProjects: [],
      previousEnvironments: [],
      previousClients: [],
      loading: true,
    };
  },
  created() {
    this.$http.all([
      this.$http.get('/octo-spy/api/projects?isMaster=true&order=id&sort=asc'),
      this.$http.get('/octo-spy/api/environments'),
      this.$http.get('/octo-spy/api/clients'),
    ])
      .then((values) => {
        this.masterProjects = values[0].data.content;
        this.environments = values[1].data.content;
        this.clients = values[2].data.content;

        this.selectedMasterProjects = this.masterProjects.map((p) => p.id)
          .sort();
        this.selectedEnvironments = this.environments.map((e) => e.id)
          .sort();
        this.selectedClients = this.clients.sort();
        this.previousMasterProjects = [...this.selectedMasterProjects];
        this.previousEnvironments = [...this.selectedEnvironments];
        this.previousClients = [...this.selectedClients];
        this.loading = false;
      })
      .then(this.reloadCharts);
  },
  methods: {
    getMasterProjectName(id) {
      return this.masterProjects.find((p) => p.id === id).name;
    },
    getEnvironmentName(id) {
      return this.environments.find((e) => e.id === id).name;
    },
    removeMasterProject(id) {
      this.selectedMasterProjects = this.selectedMasterProjects.filter((p) => p !== id);
      this.setMasterProjects();
      this.reloadCharts();
    },
    removeEnvironment(id) {
      this.selectedEnvironments = this.selectedEnvironments.filter((e) => e !== id);
      this.setEnvironments();
      this.reloadCharts();
    },
    removeClient(name) {
      this.selectedClients = this.selectedClients.filter((c) => c !== name);
      this.setClients();
      this.reloadCharts();
    },
    setMasterProjects() {
      this.selectedMasterProjects = this.selectedMasterProjects.sort();
      if (this.selectedMasterProjects.length === 0) {
        this.selectedMasterProjects = this.masterProjects.map((e) => e.id);
      }

      this.isMasterProjectsChange = this.previousMasterProjects.length
        !== this.selectedMasterProjects.length
        || !this.previousMasterProjects.every((e, i) => e === this.selectedMasterProjects[i]);
    },
    setEnvironments() {
      this.selectedEnvironments = this.selectedEnvironments.sort();
      if (this.selectedEnvironments.length === 0) {
        this.selectedEnvironments = this.environments.map((e) => e.id);
      }

      this.isEnvironmentsChange = this.previousEnvironments.length
        !== this.selectedEnvironments.length
        || !this.previousEnvironments.every((e, i) => e === this.selectedEnvironments[i]);
    },
    setClients() {
      this.selectedClients = this.selectedClients.sort();
      if (this.selectedClients.length === 0) {
        this.selectedClients = this.clients.sort();
      }

      this.isClientsChange = this.previousClients.length
        !== this.selectedClients.length
        || !this.previousClients.every((e, i) => e === this.selectedClients[i]);
    },
    resetFilters() {
      this.selectedMasterProjects = this.masterProjects.map((p) => p.id).sort();
      this.selectedEnvironments = this.environments.map((e) => e.id).sort();
      this.selectedClients = this.clients.sort();
      this.reloadCharts();
    },
    reloadCharts() {
      this.loading = true;
      this.filtersPanel = null;
      this.previousMasterProjects = [...this.selectedMasterProjects];
      this.previousEnvironments = [...this.selectedEnvironments];
      this.previousClients = [...this.selectedClients];

      this.$refs.weekDeploymentReport.reload(
        this.selectedMasterProjects,
        this.selectedEnvironments,
        this.selectedClients,
      ).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>
