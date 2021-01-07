<template>
  <div class="version-displayer">
    <table>
      <thead>
      <tr>
        <th><!-- Project name column --></th>
        <th
          class="title"
          v-bind:key="platform"
          :colspan="getNumberOfClientByPlatform(platform)"
          v-for="platform in platforms">{{ platform }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-bind:key="project"
        v-for="project in projects">
        <td class="title">{{ project }}</td>
        <td
          v-bind:class="getClass(item.project, 'version', item.platform)"
          :colspan="item.size"
          v-bind:key="item.id"
          v-for="item in getVersionList(project)">
          <div v-bind:class="getClass('version-container', item.class)">
            <div class="client-name">{{ item.client }}</div>
            <div class="version-name">{{ item.version }}</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'VersionDisplayer',
  props: {
    platforms: Array,
    projects: Array,
    clients: Array,
    versions: Object,
  },
  methods: {
    getNumberOfClientByPlatform(platform) {
      let minimum = 1;
      Object.keys(this.versions)
        .filter(project => Array.isArray(this.versions[project][platform]))
        .forEach((project) => {
          if (this.versions[project][platform].length > minimum) {
            minimum = this.versions[project][platform].length;
          }
        });
      return minimum;
    },
    getVersionList(project) {
      const list = [];
      this.platforms.forEach((platform) => {
        let size = this.getNumberOfClientByPlatform(platform);
        if (Array.isArray(this.versions[project][platform])) {
          if (this.versions[project][platform].length !== 1) {
            size = 1;
          }
          this.clients.forEach((client) => {
            this.versions[project][platform]
              .filter(item => client === item.name)
              .forEach((item) => {
                list.push({
                  client: item.name,
                  project,
                  platform,
                  version: item.version,
                  id: `${project}_${platform}_${item.name}_${item.version}`,
                  size,
                  class: item.class || '',
                });
              });
          });
        } else {
          list.push({
            client: null,
            project,
            platform,
            version: this.versions[project][platform],
            id: `${project}_${platform}_${this.versions[project][platform]}`,
            size,
            class: '',
          });
        }
      });
      return list;
    },
    getClass(...names) {
      const classObject = {};
      names.filter(name => !!name).forEach((name) => {
        classObject[name] = true;
      });
      return classObject;
    },
  },
};
</script>

<style lang="scss" scoped>
  .version-displayer {
    table {
      border-spacing: 0;

      td, th {
        text-align: center;
      }
    }

    .hot-new:after, .new:after {
      font-size: small;
      font-weight: bold;
      position: absolute;
      margin-top: -81px;
      margin-left: -40px;
      background-color: red;
      width: 5rem;
      height: 1.5rem;
      transform: rotate(-45deg);
      clip-path:polygon(30% 0, 70% 0%, 100% 100%, 0% 100%);
    }
    .hot-new:after {
      content: 'Hot';
    }
    .new:after {
      content: 'New';
    }

    .title {
      font-weight: bold;
      color: #333333;
      font-size: x-large;
      padding: 1.5rem;
    }

    .version {
      font-size: large;
      color: white;

      .version-container {
        padding: 2rem;
        min-width: 10rem;
        min-height: 5rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        .client-name {
          font-weight: bold;
          flex-basis: 25%;
          margin-bottom: auto;
        }
        .version-name {
          flex-basis: 50%;
          margin-bottom: auto;
        }
      }
    }
    .Harmony.version {
      $harmony: #AF7AC5;
      &.Development{
        background-color: $harmony;
      }
      &.Integration {
        background-color: darken($harmony, 5%);
      }
      &.Pre-production {
        background-color: darken($harmony, 10%);
      }
      &.Production {
        background-color: darken($harmony, 15%);
      }
    }
    .Karajan.version {
      $karajan: #3BDA00;
      &.Development{
        background-color: $karajan;
      }
      &.Integration {
        background-color: darken($karajan, 5%);
      }
      &.Pre-production {
        background-color: darken($karajan, 10%);
      }
      &.Production {
        background-color: darken($karajan, 15%);
      }
    }
    .Workflow.version {
      $workflow: #FFAA00;
      &.Development{
        background-color: $workflow;
      }
      &.Integration {
        background-color: darken($workflow, 5%);
      }
      &.Pre-production {
        background-color: darken($workflow, 10%);
      }
      &.Production {
        background-color: darken($workflow, 15%);
      }
    }
  }
</style>
