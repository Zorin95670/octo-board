<template>
  <div class="home">
    Welcome on Octo-Board!
    <div class="version-manager">
      <version-displayer
        :platforms="environments"
        :projects="projects"
        :clients="clients"
        :versions="versions"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import VersionDisplayer from '@/components/VersionDisplayer/VersionDisplayer.vue';

export default {
  name: 'home',
  components: { VersionDisplayer },
  created() {
    this.$http.all([
      this.$http.get('/octo-spy/api/environment'),
      this.$http.get('/octo-spy/api/deployment/last'),
    ]).then((values) => {
      values[0].data.forEach((env) => {
        this.environments.push(env.name);
      });
      this.projects = [...new Set(values[1].data.map(deployment => deployment.project))];
      this.createLastDeployments(values[1]);
    });
  },
  methods: {
    createLastDeployments(response) {
      const versions = {};
      const clients = [];
      response.data.forEach((deployment) => {
        if (!versions[deployment.project]) {
          versions[deployment.project] = {};
        }
        if (!versions[deployment.project][deployment.environment]) {
          versions[deployment.project][deployment.environment] = [];
        }
        versions[deployment.project][deployment.environment].push({
          name: deployment.client,
          version: deployment.version,
          class: this.getClass(deployment.insertDate),
        });
        if (!clients.includes(deployment.client)) {
          clients.push(deployment.client);
        }
      });
      this.clients = clients.sort();
      this.versions = versions;
    },
    getClass(text) {
      if (!text) {
        return '';
      }
      const date = moment.utc(text);
      const now = moment();
      if (this.isHotNew(date, now)) {
        return 'hot-new';
      }
      if (this.isNew(date, now)) {
        return 'new';
      }
      return '';
    },
    isHotNew(date, now) {
      return this.isNew(date, now) && (now.unix() - date.unix()) <= 3600;
    },
    isNew(date, now) {
      return date.year() === now.year()
        && date.month() === now.month()
        && (now.unix() - date.unix()) <= 86400;
    },
  },
  data() {
    return {
      environments: [],
      projects: [],
      clients: [],
      versions: null,
    };
  },
};
</script>

<style lang="scss">
  .version-manager {
    display: flex;
    justify-content: center;
  }
</style>
