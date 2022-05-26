<template>
  <div class="d-flex flex-column justify-center">
    <template v-if="dashboard">
      <h2 class="d-flex justify-center">
        {{this.dashboard.name}}
        <v-btn
          icon
          @click="navigate"
          v-if="isAdministrator()">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </h2>
      <deployment-table :parameters="this.dashboard.parameters"/>
    </template>
  </div>
</template>

<script>
import DeploymentTable from '@/components/DeploymentTable.vue';
import AuthenticationMixin from '../mixins/AuthenticationMixin';

export default {
  name: 'Dashboard',
  mixins: [AuthenticationMixin],
  components: { DeploymentTable },
  computed: {
    dashboards() {
      return this.$store.state.dashboard.items;
    },
    dashboard() {
      return this.dashboards.find((d) => d.id === parseInt(this.$route.params.id, 10));
    },
  },
  watch: {
    dashboards() {
      if (this.dashboards.length === 0) {
        return;
      }
      if (!this.dashboard) {
        this.$router.push(`/dashboards/${this.dashboards[0].id}`);
      }
    },
  },
  data() {
    return { parameters: null };
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.push('/dashboards/1');
    }
  },
  methods: {
    navigate() {
      this.$router.push(`/settings/dashboard?id=${this.dashboard.id}`);
    },
  },
};
</script>
