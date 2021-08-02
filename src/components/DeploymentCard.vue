<template>
  <v-card
    :class="deployment.color"
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

    <v-progress-linear
      indeterminate
      absolute
      bottom
      :active="deployment.inProgress"></v-progress-linear>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DeploymentCard',
  props: {
    deployment: Object,
  },
  computed: {
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
};
</script>
