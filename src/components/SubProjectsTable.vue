<template>
  <v-container fluid>
    <v-breadcrumbs :items="links"></v-breadcrumbs>
    <deployment-table :master-project="name"/>
  </v-container>
</template>

<script>
import DeploymentTable from '@/components/DeploymentTable.vue';

export default {
  name: 'SubProjectsTable',
  components: { DeploymentTable },
  data() {
    const name = this.$route.params.projectName;
    return {
      name,
      links: [{
        text: 'Dashboard',
        disabled: false,
        href: '#/',
      },
      {
        text: 'Master projects',
        disabled: false,
        href: '#/projects',
      },
      {
        text: name,
        disabled: true,
        href: `#/projects/${name}`,
      }],
    };
  },
};
</script>
