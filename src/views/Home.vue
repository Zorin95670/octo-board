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
  data() {
    return {
      platforms: ['Dev', 'QA', 'Integ', 'Pre-production', 'Production'],
      projects: ['Harmony', 'Karajan', 'OSM'],
      versions: {
        Harmony: {
          Dev: 'master',
          QA: '/',
          Integ: [{
            name: 'TF1',
            version: '5.12.0',
          }, {
            name: 'Canal SNL',
            version: '6.2.0',
          }, {
            name: 'COSOTT',
            version: '5.0.0',
          }, {
            name: 'OCS',
            version: '6.0.0',
          }],
          'Pre-production': [{
            name: 'TF1',
            version: '5.12.0',
          }],
          Production: [{
            name: 'TF1',
            version: '5.12.0',
          }, {
            name: 'Canal SNL',
            version: '6.2.0',
          }],
        },
        Karajan: {
          Dev: 'master',
          QA: '10.0.0',
          Integ: '10.0.0',
          'Pre-production': '10.0.0',
          Production: '10.0.0',
        },
        OSM: {
          Dev: '3.3.2',
          QA: '3.3.2',
          Integ: '/',
          'Pre-production': '3.3.2',
          Production: '3.3.2',
        },
      },
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
      &.Dev{
        background-color: $harmony;
      }
      &.QA {
        background-color: darken($harmony, 5%);
      }
      &.Integ {
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
      &.Dev{
        background-color: $karajan;
      }
      &.QA {
        background-color: darken($karajan, 5%);
      }
      &.Integ {
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
      &.Dev{
        background-color: $osm;
      }
      &.QA {
        background-color: darken($osm, 5%);
      }
      &.Integ {
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
