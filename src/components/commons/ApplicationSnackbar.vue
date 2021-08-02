<template>
  <v-snackbar
    v-model="show"
    top
    :color="color">
    <v-container ma-0 pa-0 fill-height fluid
                 @mouseover="onHover(true)"
                 @mouseleave="onHover(false)">
      <v-icon left v-if="icon !== null">{{ icon }}</v-icon>
      {{ message }}
    </v-container>
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-progress-linear
      v-model="percent"
      style="width: 100%"
      absolute
      bottom></v-progress-linear>
  </v-snackbar>
</template>

<script>
export default {
  name: 'ApplicationSnackbar',
  created() {
    this.$store.subscribe(this.onMessage);
  },
  data() {
    return {
      hover: false,
      percent: 0,
      test: 100,
      show: false,
      message: '',
      color: '',
      icon: null,
      timer: null,
    };
  },
  methods: {
    onMessage(mutation, state) {
      if (mutation.type === 'showMessage') {
        this.message = state.snackbar.message;
        this.color = state.snackbar.color;
        this.icon = state.snackbar.icon || null;
        this.show = true;
        this.percent = 0;
        this.timer = window.setInterval(this.closingInterval.bind(this), 100);
      }
    },
    onHover(value) {
      this.hover = value;
    },
    closingInterval() {
      if (this.hover) {
        return;
      }
      if (this.percent > 100) {
        window.clearInterval(this.timer);
        this.show = false;
        return;
      }
      this.percent += 5;
    },
  },
};
</script>
