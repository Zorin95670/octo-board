<template>
  <v-card>
    <v-card-title>New version appear!</v-card-title>
    <v-card-text
      style="overflow-y: auto;max-height: 300px;">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel
          v-bind:key="data.version"
          v-for="data in versions">
          <v-expansion-panel-header>
            {{ data.date }}: Version {{ data.version }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-if="data.features.length > 0">
              <h2>New features</h2>
              <ul>
                <li
                  v-bind:key="`feature${index}`"
                  v-for="(feature, index) in data.features">{{ feature }}
                </li>
              </ul>
            </template>
            <template v-if="data.bugs.length > 0">
              <h2>Bugs fixes</h2>
              <ul>
                <li
                  v-bind:key="`bug${index}`"
                  v-for="(bug, index) in data.bugs">{{ bug }}
                </li>
              </ul>
            </template>
            <template v-if="data.misc.length > 0">
              <h2>Misc.</h2>
              <ul>
                <li
                  v-bind:key="`misc${index}`"
                  v-for="(m, index) in data.misc">{{ m }}
                </li>
              </ul>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        color="green darken-1"
        text
        @click="this.closeDialog">
        Got it!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin';

export default {
  name: 'NewVersionsCard',
  mixins: [DialogMixin],
  computed: {
    versions() {
      return this.$store.state.dialog.data;
    },
  },
  data() {
    return {
      panel: 0,
    };
  },
};
</script>
