import Vue from 'vue';
import Router from 'vue-router';
import Page404 from '@/views/Page404.vue';
import Dashboard from '@/components/Dashboard.vue';
import HistoricTable from '@/components/HistoricTable.vue';
import MasterProjectCardList from '@/components/MasterProjectCardList.vue';
import SubProjectsTable from '@/components/SubProjectsTable.vue';
import ApplicationSettings from '@/components/commons/ApplicationSettings.vue';
import ReportPanel from './components/commons/ReportPanel.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboards/',
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: false,
      },
    },
    {
      path: '/dashboards/:id?',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: false,
      },
    },
    {
      path: '/projects',
      name: 'Master projects',
      component: MasterProjectCardList,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: true,
        actions: ['project'],
      },
    },
    {
      path: '/projects/:masterProjectName',
      name: 'Master project: {{masterProjectName}}',
      component: SubProjectsTable,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: true,
        actions: ['subProject'],
      },
    },
    {
      path: '/historic',
      name: 'Deployments historic',
      component: HistoricTable,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: false,
      },
    },
    {
      path: '/settings/:anchor?',
      name: 'settings',
      component: ApplicationSettings,
      meta: {
        requiresAuth: true,
        roles: ['ADMIN'],
        hasAction: false,
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportPanel,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: false,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found.',
      component: Page404,
      meta: {
        requiresAuth: false,
        roles: [],
        hasAction: false,
      },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const rolesText = window.localStorage.getItem('user-roles');
  const roles = (rolesText) ? rolesText.split(',') : [];
  if (!to.meta.requiresAuth || roles.some((role) => to.meta.roles.includes(role))) {
    next();
  } else {
    next('/');
  }
});

export default router;
