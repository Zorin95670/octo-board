<template>
  <v-card
    :color="color"
    align="center"
    justify="center">
    <v-card-title>{{ deployment.client }}</v-card-title>
    <v-card-text>
      <template v-if="isNew">
        <v-badge
          top right
          color="red accent-4"
          class="text-h6">
          <span
            class="d-inline-block text-truncate"
            style="max-width: 7rem"
            :title="deployment.version">
            {{ deployment.version }}
          </span>
          <span
            slot="badge"
            :title="`Deployed less than ${isHotNew ? 'an hour ago' : 'a day ago'}.`"
            style="cursor: help">
            {{ isHotNew ? 'Hot' : 'New' }}
          </span>
        </v-badge>
      </template>
      <span
        class="text-h6 d-inline-block text-truncate"
        style="max-width: 7rem"
        :title="deployment.version"
        v-else>
        {{ deployment.version }}
      </span>
    </v-card-text>

    <v-card-actions v-if="isAdministrator() && inProgress">
      <v-spacer/>
      <v-btn
        x-small
        color="warning"
        title="Stop progress."
        @click="confirmationDialog = true">
        <v-icon>mdi-stop</v-icon>
        Progress
      </v-btn>
      <v-spacer/>
    </v-card-actions>
    <v-dialog
      v-model="confirmationDialog"
      max-width="420"
      v-if="isAdministrator() && inProgress">
      <v-card>
        <v-card-title class="text-h5">
          Confirmation
        </v-card-title>

        <v-card-text>
          Stop progress for {{deployment.project}} on
          {{deployment.client}} {{deployment.environment}} ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false">
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="stopProgress">
            Yes
          </v-btn>
        </v-card-actions>

        <v-progress-linear
          indeterminate
          absolute
          bottom
          :active="progressLoading"></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-progress-linear
      indeterminate
      absolute
      bottom
      :active="inProgress"></v-progress-linear>
  </v-card>
</template>

<script>
import moment from 'moment';
import AuthenticationMixin from '../mixins/AuthenticationMixin';

export default {
  name: 'DeploymentCard',
  mixins: [AuthenticationMixin],
  props: {
    deployment: Object,
  },
  computed: {
    color() {
      return `rgb(${this.deployment.color}, ${1 - this.deployment.colorIndex * 0.1})`;
    },
    insertDate() {
      return moment.utc(this.deployment.insertDate, 'YYYY-MM-DD HH:mm:ss');
    },
    isHotNew() {
      const now = moment();
      return this.isNew && (now.unix() - this.insertDate.unix()) <= 3600;
    },
    isNew() {
      const now = moment();
      return this.insertDate.year() === now.year()
        && this.insertDate.month() === now.month()
        && (now.unix() - this.insertDate.unix()) <= 86400;
    },
  },
  data() {
    return {
      confirmationDialog: false,
      progressLoading: false,
      inProgress: this.deployment.inProgress,
    };
  },
  methods: {
    stopProgress() {
      this.progressLoading = true;
      return this.$http.delete('/octo-spy/api/deployment/progress', {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
        data: {
          project: this.deployment.project,
          environment: this.deployment.environment,
          client: this.deployment.client,
          inProgress: true,
        },
        validateStatus(status) {
          return status === 204 || status === 404;
        },
      }).then(() => {
        this.progressLoading = false;
        this.confirmationDialog = false;
        this.inProgress = false;
      });
    },
  },
};
</script>
