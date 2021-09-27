<template>
  <v-card
    align="center"
    justify="center"
    :color="`rgb(${color})`">
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text v-if="displaySubProjects">
      <v-container fluid v-if="subProjectsLoading">
        <v-progress-circular indeterminate/>
        Loading total of sub-projects.
      </v-container>
      <v-container fluid v-else>
        {{ total }} sub-projects.
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="ma-0 pa-0" style="justify-content: center">
      <v-btn
        icon
        title="See sub-projects."
        v-if="isMasterProject"
        :to="`/projects/${this.name}`"
        :disabled="subProjectsLoading">
        <v-icon>mdi-archive</v-icon>
      </v-btn>
      <v-btn
        icon
        title="See historic of project."
        :to="`/historic?project=${this.name}`">
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-menu
        v-model="colorMenu"
        :close-on-content-click="false"
        offset-y
        v-if="isAdministrator()">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            title="Project settings."
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <color-project-panel
          :project-name="name"
          :project-id="projectId"
          :project-color="defaultColor"
          @onColorUpdate="onProjectUpdate"/>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import ColorProjectPanel from '@/components/ColorProjectPanel.vue';

export default {
  name: 'ProjectCard',
  components: { ColorProjectPanel },
  mixins: [AuthenticationMixin],
  props: {
    name: String,
    projectId: Number,
    color: {
      type: String,
      default: null,
    },
    defaultColor: {
      type: String,
      default: null,
    },
    isMasterProject: {
      type: Boolean,
      default: false,
    },
    displaySubProjects: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.getTotalOfSubProject();
  },
  data() {
    return {
      colorMenu: null,
      total: 0,
      subProjectsLoading: true,
    };
  },
  methods: {
    getTotalOfSubProject() {
      if (!this.isMasterProject) {
        return false;
      }
      return this.$http.get('/octo-spy/api/projects/count', {
        params: {
          field: 'masterProject',
          masterProject: this.name,
          name: `not_${this.name}`,
        },
      })
        .then((response) => {
          this.subProjectsLoading = false;
          this.total = response.data[this.name] || 0;
        });
    },
    onProjectUpdate() {
      this.colorMenu = false;
      this.$emit('onProjectUpdate', this.projectId);
    },
  },
};
</script>
