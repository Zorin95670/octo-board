<template>
  <div style="display: flex; flex-direction: row; justify-content: space-around;">
    <dashboard-management-card/>
  </div>
</template>

<script>
import DashboardManagementCard from '@/components/cards/dashboard/DashboardManagementCard.vue';

export default {
  name: 'DashboardManagementPanel',
  components: { DashboardManagementCard },
};
</script>
