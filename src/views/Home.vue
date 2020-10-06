<template>
  <div class="home">
    Welcome on Octo-Board!
    <div class="version-manager">
      <version-displayer
        :platforms="environments"
        :projects="projects"
        :versions="versions"/>
    </div>
  </div>
</template>

<script>
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
        });
      });

      // Convert all array with one client to single client
      Object.keys(versions).forEach((project) => {
        Object.keys(versions[project])
          .filter(platform => versions[project][platform].length === 1)
          .forEach((platform) => {
            versions[project][platform] = versions[project][platform][0].version;
          });
      });
      this.versions = versions;
    },
  },
  data() {
    return {
      environments: [],
      projects: [],
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
