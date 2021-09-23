<template>
  <v-dialog
    v-model="dialog"
    max-width="400">
    <component :is="component" v-if="component !== null"/>
  </v-dialog>
</template>

<script>
import ConfirmationCard from './ConfirmationCard.vue';
import NewVersionsCard from './NewVersionsCard.vue';
import ProjectCreationCard from '../ProjectCreationCard.vue';

export default {
  name: 'ApplicationDialog',
  created() {
    this.$store.subscribe(this.onMessage);
  },
  data() {
    return {
      dialog: false,
      unreadVersions: [],
      components: {
        newVersionsCard: NewVersionsCard,
        projectCreationCard: ProjectCreationCard,
        confirmationCard: ConfirmationCard,
      },
      component: null,
    };
  },
  methods: {
    onMessage(mutation, state) {
      if (mutation.type === 'openDialog') {
        this.component = this.components[state.dialog.type];
        this.dialog = true;
      }
      if (mutation.type === 'closeDialog') {
        this.dialog = false;
        this.component = null;
      }
    },
  },
};
</script>
