<template>
  <v-container fluid>
    <v-row>
      <v-spacer/>
      <v-col cols="1">
        <v-select
          clearable
          :label="`Project: ${project || 'All'}`"
          v-model="project"
          :items="projects"
          @change="setPaginationAndSearch(1)"/>
      </v-col>
      <v-col cols="1">
        <v-select
          clearable
          :label="`Environment: ${environment || 'All'}`"
          v-model="environment"
          :items="environments"
          @change="setPaginationAndSearch(1)"/>
      </v-col>
      <v-col cols="1">
        <v-select
          clearable
          :label="`Client: ${client || 'All'}`"
          v-model="client"
          :items="clients"
          @change="setPaginationAndSearch(1)"/>
      </v-col>
      <v-col cols="1">
        <v-text-field
          clearable
          :label="`Version: ${version || 'All'}`"
          v-model="version"
          @change="setPaginationAndSearch(1)"/>
      </v-col>
      <v-col cols="1">
        <v-select
          clearable
          :label="`Is active: ${aliveText}`"
          v-model="alive"
          :items="aliveValues"
          @change="setPaginationAndSearch(1)"/>
      </v-col>
      <v-spacer/>
    </v-row>
    <v-row>
      <v-spacer/>
      <v-col cols="5">
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          @update:options="tableUpdate"
          hide-default-footer>
          <template v-slot:footer>
            <v-pagination
              v-model="pagination.page"
              :length="pagination.total"
              @input="setPaginationAndSearch"/>
          </template>
          <template v-slot:[`item.alive`]="{item}">
            {{ item.alive ? 'Yes' : 'No' }}
          </template>
        </v-data-table>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import tableConfig from '@/assets/table.historic.config.json';
import UrlMixin from '@/mixins/UrlMixin';

export default {
  name: 'HistoricTable',
  mixins: [UrlMixin],
  created() {
    this.initDataFromQuery(this.searchFields, {
      alive: (value) => `${value}`,
    });
    this.$http.get('/octo-spy/api/project').then((response) => {
      this.projects = response.data.map((project) => project.name);
    });
    this.$http.get('/octo-spy/api/environment').then((response) => {
      this.environments = response.data.map((environment) => environment.name);
    });
    this.$http.get('/octo-spy/api/client').then((response) => {
      this.clients = response.data;
    });
  },
  computed: {
    aliveText() {
      const value = this.aliveValues.find((item) => item.value === this.alive);
      return (!value) ? 'Both' : value.text;
    },
  },
  data() {
    return {
      params: {},
      lastParams: null,
      cancel: null,
      headers: tableConfig.headers,
      pagination: {
        page: 1,
        total: 0,
      },
      searchFields: ['project', 'environment', 'client', 'version', 'alive'],
      items: [],
      alive: null,
      aliveValues: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      order: null,
      sort: null,
      project: null,
      projects: [],
      environment: null,
      environments: [],
      client: null,
      clients: [],
      version: null,
      filters: {},
      loading: false,
    };
  },
  methods: {
    createQueryParameters() {
      const params = {
        page: this.pagination.page - 1,
      };
      if (this.sort !== null) {
        params.order = this.order;
        params.sort = this.sort;
      }
      this.searchFields.filter((field) => this[field] !== null)
        .forEach((field) => {
          params[field] = this[field];
        });
      return params;
    },
    setPaginationAndSearch(page = 1) {
      this.pagination.page = page;
      this.search();
    },
    tableUpdate(options) {
      if (options.sortDesc.length > 0) {
        this.sort = (options.sortDesc[0]) ? 'desc' : 'asc';
        [this.order] = options.sortBy;
      } else {
        this.sort = null;
        this.order = null;
      }
      this.setPaginationAndSearch(1);
    },
    search() {
      this.loading = true;
      const params = this.createQueryParameters();

      if (this.cancel !== null) {
        this.cancel();
      }

      return this.$http.get('/octo-spy/api/deployment', {
        params,
        cancelToken: new axios.CancelToken((source) => {
          this.cancel = source;
        }),
      }).then((response) => {
        this.cancel = null;
        this.items = response.data.resources;
        this.pagination.page = response.data.page + 1;
        this.pagination.total = Math.ceil(response.data.total / response.data.count);
        this.setUrlQueryParameters(params, ['page', 'sort', 'order']);
        this.loading = false;
      });
    },
  },
};
</script>
