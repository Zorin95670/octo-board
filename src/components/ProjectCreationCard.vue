<template>
  <v-card>
    <v-form
      ref="projectForm"
      v-model="projectValid"
      lazy-validation>
      <v-card-title>Create project.</v-card-title>
      <v-card-text>
        <v-text-field
          dense
          label="Project name"
          type="text"
          v-model="projectName"
          prepend-icon="mdi-alphabetical-variant"
          :rules="rules.name"
          :error-messages="errorMessage"
          clearable
          required></v-text-field>
        <v-select
          v-model="masterProjectName"
          v-if="!isMaster"
          :items="projects"
          label="Master project"
          :rules="rules.project"
          solo
          required></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="red darken-1"
          text
          @click="this.closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="validate">
          Create
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin';
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'ProjectCreationCard',
  mixins: [AuthenticationMixin, DialogMixin],
  computed: {
    isMaster() {
      this.loadMasterProjects();
      return this.$store.state.dialog.data?.isMaster;
    },
  },
  data() {
    return {
      errorMessage: '',
      projects: [],
      projectValid: true,
      masterProjectName: '',
      projectName: '',
      rules: {
        name: [(v) => !!v || 'Name is required.'],
        project: [(v) => !!v || 'Project is required.'],
      },
    };
  },
  watch: {
    '$route.params.masterProjectName': {
      handler(name) {
        this.masterProjectName = name;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    loadMasterProjects() {
      return this.$http.get('/octo-spy/api/projects', { params: { isMaster: true } })
        .then((response) => {
          this.projects = response.data.map((project) => project.name).sort();
        });
    },
    validate() {
      this.errorMessage = '';
      if (!this.$refs.projectForm.validate()) {
        return Promise.resolve();
      }
      const data = {
        name: this.projectName,
        isMaster: this.isMaster,
        color: '63,81,181',
      };
      if (!this.isMaster) {
        data.masterName = this.masterProjectName;
      }

      return this.$http.post('/octo-spy/api/projects', data, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          this.$store.commit(
            'showMessage',
            {
              message: `Project ${this.projectName} was created.`,
              color: 'success',
            },
          );
          if (!this.isMaster) {
            this.$root.$emit('reloadSubProject', this.masterProjectName);
          } else {
            this.$root.$emit('reloadMasterProject');
          }
          this.projectName = null;
          this.masterProjectName = null;
          this.$refs.projectForm.reset();
          this.closeDialog();
          return this.loadMasterProjects();
        })
        .catch((error) => {
          const {
            field,
            value,
          } = error.response.data;
          this.errorMessage = `Field ${field} is ${value}.`;
        });
    },
  },
};
</script>
