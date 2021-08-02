<template>
  <v-form ref="form" lazy-validation>
    <v-container>
      <v-row>
        <v-col class="ma-0 pa-0">
          <v-text-field
            dense
            label="Login"
            prepend-icon="mdi-account"
            autocomplete="username"
            v-model="username"
            :rules="rules.login"
            clearable
            required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-0">
          <v-text-field
            dense
            label="Password"
            type="password"
            autocomplete="current-password"
            v-model="password"
            prepend-icon="mdi-lock"
            :rules="rules.password"
            clearable
            required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-0">
          <v-checkbox
            dense
            v-model="keepActive"
            label="Keep my session active."
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ma-0 pa-0" style="text-align: center">
          <v-btn dense tile primary color="success" @click="validate">
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-progress-linear
      indeterminate
      absolute
      bottom
      :active="loading"></v-progress-linear>
  </v-form>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';

export default {
  name: 'AuthenticationPanel',
  mixins: [AuthenticationMixin],
  data() {
    return {
      rules: {
        login: [(v) => !!v || 'Login is required'],
        password: [(v) => !!v || 'Password is required'],
      },
      loading: false,
      username: null,
      password: null,
      keepActive: false,
    };
  },
  methods: {
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      const token = Buffer.from(`${this.username}:${this.password}`, 'utf8')
        .toString('base64');
      this.authenticate(window.localStorage, token, this.keepActive).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.authentication-panel form {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  * {
    margin-top: 5px;
  }

  .keep-active {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  button {
    width: 100px;
  }
}
</style>
