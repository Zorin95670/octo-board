import Vue from 'vue';
import Router from 'vue-router';
import Page404 from '@/views/Page404.vue';
import VersionTable from '@/components/DeploymentTable.vue';
import HistoricTable from '@/components/HistoricTable.vue';
import MasterProjectCardList from '@/components/MasterProjectCardList.vue';
import SubProjectsTable from '@/components/SubProjectsTable.vue';
import ApplicationSettings from '@/components/commons/ApplicationSettings.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: VersionTable,
    },
    {
      path: '/projects',
      name: 'Master projects',
      component: MasterProjectCardList,
    },
    {
      path: '/projects/:projectName',
      name: 'Master project: {{projectName}}',
      component: SubProjectsTable,
    },
    {
      path: '/historic',
      name: 'Deployments historic',
      component: HistoricTable,
    },
    {
      path: '/settings',
      name: 'settings',
      component: ApplicationSettings,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found.',
      component: Page404,
    },
  ],
});
