<template>
  <v-expansion-panel-content>
    <div style="display: flex; flex-direction: row; justify-content: space-around;">
      <div>
        <v-card outlined max-width="372">
          <v-form
            ref="tokenForm"
            lazy-validation>
            <v-card-title>Create token</v-card-title>
            <v-card-text>
              <v-text-field
                dense
                label="Token name"
                type="text"
                v-model="tokenName"
                prepend-icon="mdi-alphabetical-variant"
                :rules="rules"
                :error-messages="errorMessage"
                clearable
                required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="success"
                @click="saveToken">
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
      </div>
      <div>
        <v-card outlined max-width="372">
          <v-card-title>Token list</v-card-title>
          <v-card-text>
            <div v-if="tokens.length === 0">
              No token.
            </div>
            <div v-for="(name, index) in tokens" v-bind:key="`${index}${name}`">
              <v-btn
                icon
                color="red"
                @click="setDeletedToken(name)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              {{ name }}
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-expansion-panel-content>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import DialogMixin from '../mixins/DialogMixin';

export default {
  name: 'TokenManagementPanel',
  mixins: [AuthenticationMixin, DialogMixin],
  created() {
    this.loadTokens();
    this.$root.$on('deleteToken', this.deleteToken);
  },
  data() {
    return {
      errorMessage: '',
      progress: false,
      tokenName: '',
      tokens: [],
      rules: [
        (v) => !!v || 'Name is required.',
      ],
    };
  },
  methods: {
    loadTokens() {
      return this.$http.get('/octo-spy/api/users/token', {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then((response) => {
          this.tokens = response.data.sort();
          return Promise.resolve();
        });
    },
    saveToken() {
      this.errorMessage = '';
      this.tokenName = this.tokenName.trim();
      if (!this.$refs.tokenForm.validate()) {
        return Promise.resolve();
      }
      this.progress = true;

      return this.$http.post('/octo-spy/api/users/token', this.tokenName, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
          'Content-Type': 'text/plain',
        },
      })
        .then((response) => {
          this.progress = false;
          this.$refs.tokenForm.reset();
          this.$store.commit(
            'showMessage',
            {
              message: `Token created. Please copy your token because you cannot get another copy. Token: "${response.data.token}"`,
              color: 'success',
              timeout: 15,
            },
          );
          return this.loadTokens();
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
    setDeletedToken(name) {
      this.openDialog('confirmationCard', {
        text: `Delete token ${name} ?`,
        event: 'deleteToken',
        eventData: name,
      });
    },
    deleteToken(name) {
      return this.$http.delete('/octo-spy/api/users/token', {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
        params: {
          name,
        },
      }).then(() => this.loadTokens());
    },
  },
};
</script>
