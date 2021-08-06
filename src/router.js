import Vue from 'vue';
import Router from 'vue-router';
import Page404 from '@/views/Page404.vue';
import VersionTable from '@/components/DeploymentTable.vue';
import HistoricTable from '@/components/HistoricTable.vue';
import MasterProjectCardList from '@/components/MasterProjectCardList.vue';
import SubProjectsTable from '@/components/SubProjectsTable.vue';
import ApplicationSettings from '@/components/commons/ApplicationSettings.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: VersionTable,
      meta: {
        requiresAuth: false,
        roles: [],
      },
    },
    {
      path: '/projects',
      name: 'Master projects',
      component: MasterProjectCardList,
      meta: {
        requiresAuth: false,
        roles: [],
      },
    },
    {
      path: '/projects/:projectName',
      name: 'Master project: {{projectName}}',
      component: SubProjectsTable,
      meta: {
        requiresAuth: false,
        roles: [],
      },
    },
    {
      path: '/historic',
      name: 'Deployments historic',
      component: HistoricTable,
      meta: {
        requiresAuth: false,
        roles: [],
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: ApplicationSettings,
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'],
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found.',
      component: Page404,
      meta: {
        requiresAuth: false,
        roles: [],
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const rolesText = window.localStorage.getItem('user-roles');
  const roles = (rolesText) ? rolesText.split(',') : [];
  if (!to.meta.requiresAuth || roles.some((role) => to.meta.roles.includes(role))) {
    next();
  } else {
    next('/');
  }
});

export default router;
