<template>
  <v-container fluid>
    <deployment-table :master-project="name"/>
  </v-container>
</template>

<script>
import DeploymentTable from '@/components/DeploymentTable.vue';

export default {
  name: 'SubProjectsTable',
  components: { DeploymentTable },
  computed: {
    name() {
      return this.$route.params.projectName;
    },
  },
};
</script>
