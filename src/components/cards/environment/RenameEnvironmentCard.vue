<template>
  <v-card outlined>
    <v-form
      ref="environmentForm"
      lazy-validation>
      <v-card-title>Update environment name</v-card-title>
      <v-card-text>
        <div v-if="environments.length === 0">
          No environment to rename.
        </div>
        <div class="ma-2" v-else>
          <v-select
            v-model="id"
            :items="environments"
            item-text="name"
            item-value="id"
            label="Select"
            single-line></v-select>
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
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="openRenameDialog">
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import DialogMixin from '@/mixins/DialogMixin';

export default {
  name: 'RenameEnvironmentCard',
  mixins: [AuthenticationMixin, DialogMixin],
  props: {
    environments: Array,
  },
  created() {
    this.$root.$on('renameEnvironment', this.save);
  },
  beforeDestroy() {
    this.$root.$off('renameEnvironment', this.save);
  },
  data() {
    return {
      id: null,
      name: '',
      errorMessage: '',
      rules: [
        (v) => !!v || 'Name is required.',
      ],
    };
  },
  watch: {
    environments() {
      if (this.environments.length > 0) {
        this.id = this.environments[0].id;
      } else {
        this.id = null;
      }
    },
  },
  methods: {
    openRenameDialog() {
      const old = this.environments
        .find((environment) => environment.id === this.id);
      this.openDialog('confirmationCard', {
        text: `Rename environment ${old.name} to ${this.name} ?`,
        event: 'renameEnvironment',
        eventData: {
          id: this.id,
          name: this.name,
        },
      });
    },
    save(data) {
      return this.$http.patch(`/octo-spy/api/environments/${data.id}`, {
        name: data.name,
      }, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
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
          this.errorMessage = `Field ${field} is ${value}.`;
        });
    },
  },
};
</script>
