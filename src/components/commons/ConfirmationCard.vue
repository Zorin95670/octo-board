<template>
  <v-card>
    <v-card-title class="text-h5">
      Confirmation
    </v-card-title>

    <v-card-text v-html="text"></v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="red darken-1"
        text
        @click="closeDialog">
        No
      </v-btn>

      <v-btn
        color="green darken-1"
        text
        @click="validate">
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DialogMixin from '../../mixins/DialogMixin';

export default {
  name: 'ConfirmationCard',
  mixins: [DialogMixin],
  computed: {
    text() {
      return this.$store.state.dialog.data?.text;
    },
    event() {
      return this.$store.state.dialog.data?.event;
    },
    eventData() {
      return this.$store.state.dialog.data?.eventData;
    },
  },
  methods: {
    validate() {
      if (this.event) {
        this.$root.$emit(this.event, this.eventData);
      }
      this.closeDialog();
    },
  },
};
</script>
