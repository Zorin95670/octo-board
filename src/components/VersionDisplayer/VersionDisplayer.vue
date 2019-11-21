<template>
  <div class="version-displayer">
    <table>
      <thead>
      <tr>
        <th></th>
        <th
          v-bind:class="getClass('platform', platform)"
          v-bind:key="platform"
          v-for="platform in platforms">{{platform}}</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-bind:class="getClass('project', project)"
        v-bind:key="project"
        v-for="project in projects">
        <td class="project-name">{{project}}</td>
        <template
          v-for="platform in platforms">
          <td
            v-bind:class="getClass('version', platform)"
            v-bind:key="`${project}_${platform}`">
            <div v-bind:class="getClass('version', platform)">
              <template v-if="!Array.isArray(getVersion(versions, project, platform))">
                {{getVersion(versions, project, platform)}}
              </template>
              <template v-else>
                <div class="sub-version-container">
                  <div class="sub-version"
                       v-bind:key="`${project}_${index}_${platform}`"
                       v-for="(client, index) in getVersion(versions, project, platform)">
                    <div class="sub-version-header">{{client.name}}</div>
                    <div class="sub-version-body">{{client.version}}</div>
                  </div>
                </div>
              </template>
            </div>
          </td>
        </template>
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
    versions: Object,
  },
  data() {
    return {
      maxClientPerPlatforms: this.getMaxClientPerPlatforms(this.versions),
    };
  },
  methods: {
    getVersion(versions, project, platform) {
      if (!versions || !versions[project] || !versions[project][platform]) {
        return null;
      }
      return versions[project][platform];
    },
    getMaxClientPerPlatforms(versions) {
      if (!versions) {
        return {};
      }
      const result = {};
      Object.keys(versions).forEach((project) => {
        Object.keys(versions[project]).forEach((platform) => {
          const version = versions[project][platform];
          const number = Array.isArray(version) ? version.length : 1;
          if (!result[platform]) {
            result[platform] = 1;
          }
          if (result[platform] < number) {
            result[platform] = number;
          }
        });
      });

      return result;
    },
    getClass(...names) {
      const classObject = {};
      names.forEach((name) => { classObject[name] = true; });
      return classObject;
    },
  },
};
</script>

<style lang="scss" scoped>
  .version-displayer {
    table {
      border-spacing: 0;
    }

    .version {
      text-align: center;
      min-width: 10rem;

      .sub-version-container {
        display: inline-flex;

        .sub-version {
          padding: 0 5px 0 5px;

          &:not(:first-child) {
            border-left: 1px black dashed;
          }
          .sub-version-header {
            font-weight: bold;
          }
          .sub-version-header, .sub-version-body {
            text-align: center;
          }
        }
      }
    }
  }
</style>
