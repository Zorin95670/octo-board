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
        @click="openConfirmationDialog">
        <v-icon>mdi-stop</v-icon>
        Progress
      </v-btn>
      <v-spacer/>
    </v-card-actions>

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
import DialogMixin from '../mixins/DialogMixin';

export default {
  name: 'DeploymentCard',
  mixins: [AuthenticationMixin, DialogMixin],
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
      inProgress: this.deployment.inProgress,
    };
  },
  created() {
    this.$root.$on(`stopProgress_${this.deployment.id}`, this.stopProgress);
  },
  beforeDestroy() {
    this.$root.$off(`stopProgress_${this.deployment.id}`, this.stopProgress);
  },
  methods: {
    openConfirmationDialog() {
      const { client, environment, project } = this.deployment;
      this.openDialog('confirmationCard', {
        text: `Stop progress for ${project} on ${client} ${environment} ?`,
        event: `stopProgress_${this.deployment.id}`,
      });
    },
    stopProgress() {
      return this.$http.delete('/octo-spy/api/deployments/progress', {
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
        this.inProgress = false;
      });
    },
  },
};
</script>
