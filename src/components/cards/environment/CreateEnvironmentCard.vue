<template>
  <v-card outlined max-width="372">
    <v-form
      ref="environmentForm"
      lazy-validation>
      <v-card-title>Create environment</v-card-title>
      <v-card-text>
        <v-text-field
          dense
          label="Environment name"
          type="text"
          v-model="name"
          prepend-icon="mdi-alphabetical-variant"
          :rules="rules"
          :error-messages="errorMessage"
          clearable
          required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="save">
          <v-icon left>mdi-content-save</v-icon>
          Create
        </v-btn>
      </v-card-actions>
    </v-form>

    <v-progress-linear
      indeterminate
      absolute
      bottom
      :active="progress"></v-progress-linear>
  </v-card>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'CreateEnvironmentCard',
  mixins: [AuthenticationMixin],
  data() {
    return {
      progress: false,
      name: '',
      errorMessage: '',
      rules: [
        (v) => !!v || 'Name is required.',
      ],
    };
  },
  methods: {
    save() {
      this.errorMessage = '';
      this.name = this.name.trim();
      if (!this.$refs.environmentForm.validate()) {
        return Promise.resolve();
      }
      this.progress = true;

      return this.$http.post('/octo-spy/api/environments', {
        name: this.name,
        position: 0,
      }, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          this.progress = false;
          this.errorMessage = '';
          this.name = '';
          this.$refs.environmentForm.reset();
          this.$root.$emit('reloadEnvironments');
        })
        .catch((error) => {
          const {
            field,
            value,
          } = error.response.data;
          this.progress = false;
          this.errorMessage = `Field ${field} is ${value}.`;
        });
    },
  },
};
</script>
