<template>
  <div class="project-deployments-historic">
    <h2>
      <router-link
        to="/"
        v-slot="{ href, route, navigate, isActive, isExactActive }">
        <a
          class="link-effect"
          :active="isActive"
          :href="href"
          :title="`Back to home page.`"
          @click="navigate">Back to home page</a>
      </router-link>
    </h2>
    <h2>Historic of {{ this.$route.params.projectName }}'s deployments</h2>

    <awesome-table
      :headers="headers"
      :sort="sort"
      :filters="filters"
      :data="deployments"
      :pagination="pagination"
      :options="options"
      :loading="loading"
      @search="search"></awesome-table>
  </div>
</template>

<script>
export default {
  name: 'ProjectDeploymentsHistoric',
  data() {
    return {
      deployments: [],
      headers: [{
        name: 'environment',
        title: 'Environment',
      }, {
        name: 'client',
        title: 'Client',
      }, {
        name: 'version',
        title: 'Version',
      }, {
        name: 'insertDate',
        title: 'Deployment date',
      }, {
        name: 'alive',
        title: 'Active version',
      }],
      sort: {
        name: 'insertDate',
        type: 'desc',
      },
      pagination: {
        total: 0,
        limit: 10,
        start: 0,
      },
      filters: {
        project: {
          type: 'text',
          value: this.$route.params.projectName,
          timeout: 1000,
        },
        client: {
          type: 'text',
          value: '',
          timeout: 1000,
        },
        version: {
          type: 'text',
          value: '',
          timeout: 1000,
        },
        environment: {
          type: 'list',
          value: '',
          items: [
            'Development',
            'Integration',
            'Pre-production',
            'Production',
          ],
        },
      },
      options: {
        multipleSelection: false,
        displayRowDetail: false,
        multiSelectionCheckboxAllVisiblity: false,
      },
      loading: true,
    };
  },
  created() {
    this.search(this.filters, this.sort, this.pagination, true);
  },
  methods: {
    search(filters, sort, pagination, redirectOnNoData = false) {
      this.loading = true;
      const params = Object.keys(filters)
        .filter(filter => filters[filter].value.length > 0)
        .reduce((acc, filter) => {
          acc[filter] = filters[filter].value.replace(/\*/g, '%');
          return acc;
        }, {});

      params.count = pagination.limit;
      params.page = pagination.start;

      if (sort.type !== '') {
        params.order = sort.name;
        params.sort = sort.type;
      }

      this.$http.get('/octo-spy/api/deployment', { params })
        .then((response) => {
          this.pagination.start = response.data.page;
          this.pagination.limit = response.data.count;
          this.pagination.total = response.data.total;
          if (redirectOnNoData && response.data.total === 0) {
            this.redirect();
            return;
          }
          this.deployments = response.data.resources
            .map(resource => ({ ...resource, alive: resource.alive ? 'Yes' : 'No' }));
          this.loading = false;
        }).catch(this.errorOnLoading);
    },
    errorOnLoading(response) {
      this.$snotify.error(response.data.message, 'Retrieving deployments');
    },
    redirect() {
      this.$snotify.warning('You will be redirected to the home page, '
        + 'because your project does not contain any deployments.', 'Redirection')
        .on('hidden', () => {
          this.$router.push('/');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.project-deployments-historic {
  display: flex;
  flex-direction: column;
  align-items: center;

  .AwesomeTable {
    max-width: 75rem;
  }
}
</style>
