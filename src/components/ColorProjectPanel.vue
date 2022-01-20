<template>
  <v-form
    ref="colorForm"
    lazy-validation>
    <v-card class="pa-5">
      <v-card-title>{{ projectName }}: settings</v-card-title>
      <v-color-picker
        dot-size="25"
        hide-canvas
        mode="rgba"
        show-swatches
        swatches-max-height="100"
        v-model="rgbColor"/>
      <v-card-actions>
        <v-btn
          :disabled="rgbColor === defaultRgbColor"
          color="success"
          @click="validate">
          <v-icon>mdi-arrow-up-bold</v-icon>
          Update
        </v-btn>
        <v-btn
          :disabled="rgbColor === defaultRgbColor"
          color="error"
          @click="rgbColor = defaultRgbColor">
          <v-icon>mdi-broom</v-icon>
          Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import AuthenticationMixin from '../mixins/AuthenticationMixin';

export default {
  name: 'ColorProjectPanel',
  mixins: [AuthenticationMixin],
  props: {
    projectName: String,
    projectId: Number,
    projectColor: String,
  },
  data() {
    const rgb = ['r', 'g', 'b'];
    const color = {};
    (this.projectColor || '63,81,181')
      .split(',')
      .forEach((value, index) => {
        color[rgb[index]] = parseInt(value, 10);
      });
    return {
      rgbColor: color,
      defaultRgbColor: this.projectColor ? color : null,
    };
  },
  methods: {
    validate() {
      if (this.rgbColor === this.defaultRgbColor) {
        return false;
      }
      const data = {
        color: `${this.rgbColor.r},${this.rgbColor.g},${this.rgbColor.b}`,
      };

      return this.$http.patch(`/octo-spy/api/projects/${this.projectId}`, data, {
        headers: {
          Authorization: `Basic ${this.getUserToken()}`,
        },
      }).then(() => {
        this.$emit('onColorUpdate', data.color);
      });
    },
  },
};
</script>
