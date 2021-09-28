<template>
  <div style="display: flex; flex-direction: row; justify-content: space-around;">
    <div>
      <v-card outlined max-width="372">
        <v-form
          ref="administratorPasswordForm"
          v-model="administratorPasswordValid"
          lazy-validation>
          <v-card-title>Change password</v-card-title>
          <v-card-text>
            <v-text-field
              dense
              label="New password"
              type="password"
              autocomplete="current-password"
              v-model="password"
              prepend-icon="mdi-lock"
              :rules="rules.password"
              clearable
              required></v-text-field>
            <v-text-field
              dense
              label="Confirm password"
              type="password"
              autocomplete="current-password"
              v-model="passwordConfirmation"
              prepend-icon="mdi-lock-check"
              :rules="rules.passwordConfirmation"
              clearable
              required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!administratorPasswordValid"
              color="success"
              @click="administratorPasswordValidation">
              <v-icon left>mdi-content-save</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </div>
    <div>
      <v-card outlined max-width="372">
        <v-form
          ref="administratorEmailForm"
          v-model="administratorEmailValid"
          lazy-validation>
          <v-card-title>Change email</v-card-title>
          <v-card-text>
            <v-text-field
              dense
              label="New email"
              type="email"
              autocomplete=""
              v-model="email"
              prepend-icon="mdi-email"
              :rules="rules.email"
              clearable
              required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!administratorEmailValid"
              color="success"
              @click="administratorEmailValidation">
              <v-icon left>mdi-content-save</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'AdministratorSettings',
  mixins: [AuthenticationMixin],
  computed: {
    login() {
      return this.$store.state.user.login;
    },
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      administratorPasswordValid: true,
      administratorEmailValid: true,
      password: '',
      passwordConfirmation: '',
      email: '',
      rules: {
        password: [
          (v) => !!v || 'Password is required.',
          (v) => (v.length >= 8 && v.length <= 50)
            || 'Password size must be between 8 and 50 characters.',
        ],
        passwordConfirmation: [
          (v) => !!v || 'Password confirmation is required.',
          (v) => v === this.password || 'Different to password.',
        ],
        email: [
          (v) => !!v || 'E-mail is required.',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        ],
      },
    };
  },
  methods: {
    administratorPasswordValidation() {
      if (!this.$refs.administratorPasswordForm.validate()) {
        return;
      }

      this.$http.put('/octo-spy/api/administrator/password', Buffer.from(this.password, 'utf8')
        .toString('base64'), {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          if (this.login === 'admin') {
            this.updateToken(window.localStorage, Buffer.from(`admin:${this.password}`, 'utf8')
              .toString('base64'));
          }
          this.$refs.administratorPasswordForm.reset();
          this.$store.commit(
            'showMessage',
            { message: 'Password updated.', color: 'success' },
          );
        });
    },
    administratorEmailValidation() {
      if (!this.$refs.administratorEmailForm.validate()) {
        return;
      }

      this.$http.put('/octo-spy/api/administrator/email', this.email, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          this.$store.commit('setUser', {
            ...this.user,
            email: this.email,
          });

          this.$refs.administratorEmailForm.reset();
          this.$store.commit(
            'showMessage',
            { message: 'E-mail updated.', color: 'success' },
          );
        });
    },
  },
};
</script>
