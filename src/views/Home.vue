<template>
  <div class="home">
    Welcome on Octo-Board!
    <div class="version-manager">
      <version-displayer
        :platforms="platforms"
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
    this.$http.get('/octo-spy/api/deployment/last').then(this.createLastDeployments);
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
      platforms: ['Development', 'QA', 'Integration', 'Pre-production', 'Production'],
      projects: ['Harmony', 'Karajan', 'OSM'],
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
  .version-displayer {
    .platform, .project-name {
      font-weight: bold;
      color: #333333;
      font-size: large;
    }
    .version {
      font-size: medium;
      color: white;
    }
    .Harmony .version {
      $harmony: #AF7AC5;
      &.Development{
        background-color: $harmony;
      }
      &.QA {
        background-color: darken($harmony, 5%);
      }
      &.Integration {
        background-color: darken($harmony, 10%);
      }
      &.Pre-production {
        background-color: darken($harmony, 15%);
      }
      &.Production {
        background-color: darken($harmony, 20%);
      }
    }
    .Karajan .version {
      $karajan: #F39C12;
      &.Development{
        background-color: $karajan;
      }
      &.QA {
        background-color: darken($karajan, 5%);
      }
      &.Integration {
        background-color: darken($karajan, 10%);
      }
      &.Pre-production {
        background-color: darken($karajan, 15%);
      }
      &.Production {
        background-color: darken($karajan, 20%);
      }
    }
    .OSM .version {
      $osm: #16a085;
      &.Development{
        background-color: $osm;
      }
      &.QA {
        background-color: darken($osm, 5%);
      }
      &.Integration {
        background-color: darken($osm, 10%);
      }
      &.Pre-production {
        background-color: darken($osm, 15%);
      }
      &.Production {
        background-color: darken($osm, 20%);
      }
    }
  }
</style>
