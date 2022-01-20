<template>
  <v-card outlined>
    <v-card-title>Environment list</v-card-title>
    <v-card-text>
      <div v-if="environments.length === 0">
        No environment.
      </div>
      <div
        class="ma-5"
        draggable="true"
        @dragstart="dragStart($event, index)"
        @dragleave="drag.to = index"
        @dragend="update"
        v-for="(environment, index) in environments"
        v-bind:key="environment.id">
        <v-btn :id="`env_${index}`">
          <v-icon>mdi-drag-vertical</v-icon>
          {{ environment.name }}
        </v-btn>
        <v-btn
          icon
          color="red"
          @click="openDeletedDialog(environment.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        @click="reset"
        :disabled="changes.length === 0">
        <v-icon left>mdi-restore</v-icon>
        Reset
      </v-btn>
      <v-btn
        color="success"
        @click="openChangesDialog"
        :disabled="changes.length === 0">
        <v-icon left>mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthenticationMixin from '@/mixins/AuthenticationMixin';
import DialogMixin from '@/mixins/DialogMixin';

export default {
  name: 'ListEnvironmentCard',
  mixins: [AuthenticationMixin, DialogMixin],
  props: {
    defaultEnvironments: Array,
  },
  watch: {
    defaultEnvironments() {
      this.environments = this.initEnvironments();
    },
  },
  created() {
    this.$root.$on('saveEnvironmentsOrder', this.save);
    this.$root.$on('deleteEnvironment', this.delete);
  },
  beforeDestroy() {
    this.$root.$off('saveEnvironmentsOrder', this.save);
    this.$root.$off('deleteEnvironment', this.delete);
  },
  data() {
    return {
      changes: [],
      drag: {
        from: null,
        to: null,
      },
      environments: [],
    };
  },
  methods: {
    initEnvironments() {
      return this.defaultEnvironments.map((environment) => ({ ...environment }));
    },
    openChangesDialog() {
      this.openDialog('confirmationCard', {
        text: 'Change environments order ?',
        event: 'saveEnvironmentsOrder',
      });
    },
    openDeletedDialog(id) {
      const environment = this.environments.find((e) => e.id === id);
      this.openDialog('confirmationCard', {
        text: `Delete environment ${environment.name} ?`,
        event: 'deleteEnvironment',
        eventData: id,
      });
    },
    delete(id) {
      return this.$http.delete(`/octo-spy/api/environments/${id}`, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      })
        .then(() => {
          this.$root.$emit('reloadEnvironments');
        });
    },
    reset() {
      this.environments = this.initEnvironments();
    },
    update() {
      const {
        from,
        to,
      } = this.drag;
      const diff = to - from;
      if (diff === 0) {
        return;
      }
      this.changes = [];
      const array = this.arrayMove(this.environments, from, to);

      array.forEach((environment, index) => {
        environment.position = index;
      });
      this.environments = array;
      this.changes = this.environments
        .filter((e1) => this.defaultEnvironments
          .find((e2) => e2.id === e1.id).position !== e1.position)
        .map((environment) => environment.id);
    },
    arrayMove(array, fromIndex, toIndex) {
      const result = [...array];
      const startIndex = fromIndex < 0 ? result.length + fromIndex : fromIndex;

      if (startIndex >= 0 && startIndex < result.length) {
        const endIndex = toIndex < 0 ? result.length + toIndex : toIndex;

        const [item] = result.splice(fromIndex, 1);
        result.splice(endIndex, 0, item);
      }
      return result;
    },
    save() {
      Promise.allSettled(this.environments
        .filter((environment) => this.changes.includes(environment.id))
        .map((environment) => this.$http.patch(`/octo-spy/api/environments/${environment.id}`, {
          position: environment.position,
          name: environment.name,
        }, {
          headers: {
            Authorization: `Basic ${this.getUserToken()}`,
          },
        })))
        .then(() => {
          this.$root.$emit('reloadEnvironments');
        });
    },
    dragStart(event, index) {
      const img = document.getElementById(`env_${index}`);
      event.dataTransfer.setDragImage(img, 25, 25);
      this.drag.from = index;
    },
  },
};
</script>
