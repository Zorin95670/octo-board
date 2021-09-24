const DialogMixin = {
  methods: {
    openDialog(type, data = null) {
      this.$store.commit('openDialog', { type, data });
    },
    closeDialog() {
      this.$store.commit('closeDialog');
    },
  },
};

export default DialogMixin;
