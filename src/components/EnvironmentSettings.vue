<template>
  <div style="display: flex; flex-direction: row; justify-content: space-around;">
    <div>
      <create-environment-card/>
    </div>
    <div>
      <rename-environment-card :environments="environments"/>
    </div>
    <div>
      <list-environment-card :default-environments="environments"/>
    </div>
  </div>
</template>

<script>
import CreateEnvironmentCard from '@/components/cards/environment/CreateEnvironmentCard.vue';
import RenameEnvironmentCard from '@/components/cards/environment/RenameEnvironmentCard.vue';
import ListEnvironmentCard from '@/components/cards/environment/ListEnvironmentCard.vue';

export default {
  name: 'EnvironmentSettings',
  components: { ListEnvironmentCard, RenameEnvironmentCard, CreateEnvironmentCard },
  created() {
    this.loadEnvironments();
    this.$root.$on('reloadEnvironments', this.loadEnvironments);
  },
  beforeDestroy() {
    this.$root.$off('reloadEnvironments', this.loadEnvironments);
  },
  data() {
    return {
      environments: [],
    };
  },
  methods: {
    loadEnvironments() {
      return this.$http.get('/octo-spy/api/environments')
        .then((response) => {
          this.environments = response.data.content;
          return response;
        });
    },
  },
};
</script>
