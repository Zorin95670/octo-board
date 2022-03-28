<template>
  <v-card
    outlined
    :min-width="preview? '100%' : ''"
    :width="preview? '100%' : ''"
    :max-width="preview? '100%' : ''"
    id="card1">
    <v-form
      ref="dashboardForm"
      lazy-validation>
      <v-card-title v-if="creation">Create dashboard</v-card-title>
      <v-card-title v-else>Update dashboard</v-card-title>
      <v-card-text class="d-flex flex-column justify-center align-center">
        <v-radio-group row v-model="creation">
          <v-radio
            label="Create"
            :value="true"/>
          <v-radio
            label="Update"
            :value="false"/>
        </v-radio-group>
        <v-select
          v-model="selectedDashboard"
          label="Dashboard"
          :items="dashboards"
          item-text="name"
          item-value="id"
          v-if="!creation"
        ></v-select>
        <v-text-field
          dense
          label="Display's name"
          type="text"
          v-model="name"
          prepend-icon="mdi-alphabetical-variant"
          :rules="rules"
          :error-messages="errorMessage"
          clearable
          required></v-text-field>
        <v-radio-group
          row
          v-model="visible"
          :disabled="isDisabled">
          <v-radio
            label="Public"
            :value="true"/>
          <v-radio
            label="Private"
            :value="false"/>
        </v-radio-group>
        <v-chip-group>
          <v-chip
            close
            close-icon="mdi-delete"
            :key="`chip_${chip.field}`"
            v-for="chip in chips"
            @click:close="reset(chip.field)">
            {{chip.text}}
          </v-chip>
        </v-chip-group>
        <v-select
          v-model="selectedFilter"
          label="Filters"
          :items="filters"
          item-text="name"
          item-value="field"
        ></v-select>
        <template v-if="currentFilter">
          <template v-if="currentFilter.type === 'boolean'">
            <v-radio-group row v-model="currentFilter.value">
              <v-radio label="All projects" :value="0"/>
              <v-radio label="Only master projects" :value="'true'"/>
              <v-radio label="Only sub-projects" :value="'false'"/>
            </v-radio-group>
          </template>
          <template v-else>
            <v-text-field
              dense
              :label="currentFilter.name"
              type="text"
              v-model="currentFilter.value"
              prepend-icon="mdi-alphabetical-variant"
              clearable></v-text-field>
            <v-chip
              class="ma-2 pt-5 pb-5"
              label
              color="warning"
              outlined>
              <v-icon left>mdi-information-outline</v-icon>
              You can find all filter's usage in the&nbsp;
              <a
                href="https://zorin95670.github.io/octo-docs/#query-filter-explanation"
                target="blank">
                documentation
              </a>.
            </v-chip>
          </template>
        </template>
      </v-card-text>
      <deployment-table :parameters="parameters" v-if="preview"/>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="success"
          @click="save"
          v-if="creation">
          <v-icon left>mdi-content-save</v-icon>
          Create
        </v-btn>
        <v-btn
          color="success"
          @click="update"
          v-else>
          <v-icon left>mdi-content-save</v-icon>
          Update
        </v-btn>
        <v-btn
          color="primary"
          @click="preview = !preview">
          <v-icon left v-if="preview">mdi-eye-off</v-icon>
          <v-icon left v-else>mdi-eye</v-icon>
          Preview
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import filters from '@/assets/dashboardFilters.json';
import DeploymentTable from '../../DeploymentTable.vue';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'DashboardManagementCard',
  components: { DeploymentTable },
  mixins: [AuthenticationMixin],
  computed: {
    currentFilter() {
      return this.filters.find((filter) => filter.field === this.selectedFilter);
    },
    chips() {
      return this.filters
        .filter((f) => f.value !== '' && f.value !== 0)
        .map((filter) => ({
          text: `${filter.name}: ${filter.value}`,
          field: filter.field,
        }));
    },
    isDisabled() {
      return !this.creation && this.dashboard?.canBeDeleted === false;
    },
    parameters() {
      return this.filters.reduce((acc, filter) => {
        if (filter.field === 'onMasterProject' && filter.value === 0) {
          return acc;
        }
        if (filter.value === '') {
          return acc;
        }
        acc[filter.field] = filter.value;
        return acc;
      }, {});
    },
    dashboard() {
      return this.dashboards.find((d) => d.id === this.selectedDashboard);
    },
    dashboards() {
      return this.$store.state.dashboard.items;
    },
  },
  watch: {
    dashboards() {
      if (!this.$route.query.id || !this.dashboards) {
        return;
      }
      const id = parseInt(this.$route.query.id, 10);
      if (this.$store.state.dashboard.items
        .filter((dashboard) => dashboard.id === id).length === 0) {
        this.selectedDashboard = null;
      } else {
        this.selectedDashboard = id;
        this.creation = false;
      }
    },
    creation() {
      this.name = (!this.creation && this.dashboard) ? this.dashboard.name : '';
      this.visible = (!this.creation && this.dashboard) ? this.dashboard.visible : false;

      this.filters.forEach((filter) => {
        if (this.creation) {
          filter.value = '';
        } else if (this.dashboard) {
          const value = this.dashboard.parameters[filter.field];
          filter.value = value || '';
        } else {
          filter.value = '';
        }
      });
      this.$refs.dashboardForm.resetValidation();
      this.setUrl();
    },
    selectedDashboard() {
      this.creation = this.selectedDashboard === null;
      this.name = this.dashboard?.name;
      this.visible = this.dashboard?.visible;
      this.filters.forEach((filter) => {
        if (this.dashboard) {
          const value = this.dashboard.parameters[filter.field];
          filter.value = value || '';
        } else {
          filter.value = '';
        }
      });
      this.setUrl();
    },
  },
  data() {
    return {
      selectedDashboard: null,
      preview: false,
      selectedFilter: '',
      filters,
      creation: true,
      name: '',
      visible: false,
      errorMessage: '',
      rules: [
        (v) => !!v || 'Name is required.',
      ],
    };
  },
  mounted() {
    this.selectedDashboard = parseInt(this.$route.query.id, 10) || null;
  },
  methods: {
    reset(field) {
      this.filters.find((filter) => filter.field === field)
        .value = (field === 'onMasterProject') ? 0 : '';
    },
    setUrl() {
      const url = (this.selectedDashboard === null || this.creation)
        ? '/settings/dashboard'
        : `/settings/dashboard?id=${this.selectedDashboard}`;

      if (this.$route.fullPath !== url) {
        this.$router.push(url);
      }
    },
    save() {
      let id;
      return this.$http.post('/octo-spy/api/dashboards', {
        name: this.name,
        visible: this.visible,
        parameters: this.parameters,
      }, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      }).then((response) => {
        id = response.data.id;
        return this.$store.dispatch('loadDashboards', {
          visible: this.visible,
          token: this.getUserToken(),
        });
      }).then(() => this.$store.commit(
        'showMessage',
        { message: 'Dashboard created.', color: 'success' },
      )).then(() => {
        this.selectedDashboard = id;
      });
    },
    update() {
      return this.$http.post(`/octo-spy/api/dashboards/${this.dashboard.id}`, {
        name: this.name,
        visible: this.visible,
        parameters: this.parameters,
      }, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      }).then(() => this.$store.dispatch('loadDashboards', {
        visible: this.visible,
        token: this.getUserToken(),
      })).then(() => this.$store.commit(
        'showMessage',
        { message: 'Dashboard updated.', color: 'success' },
      ));
    },
  },
};
</script>
