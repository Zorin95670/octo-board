import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/commons/ReportPanel.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();
const vuetify = new Vuetify();

localVue.use(VueAxios, axios);

describe('ReportPanel', () => {
  let wrapper;

  beforeEach(async () => {
    mock.onGet('/octo-spy/api/projects?isMaster=true&order=id&sort=asc')
      .reply(200, {
        content: [{
          id: 1,
          name: 'master1',
        }, {
          id: 2,
          name: 'master2',
        }],
      });
    mock.onGet('/octo-spy/api/environments')
      .reply(200, {
        content: [{
          id: 1,
          name: 'env1',
        }, {
          id: 2,
          name: 'env2',
        }],
      });
    mock.onGet('/octo-spy/api/clients')
      .reply(200, {
        content: ['client1', 'client2'],
      });

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
    wrapper.vm.$refs.weekDeploymentReport = { reload: () => Promise.resolve() };
  });

  it('Test computed: canReload', () => {
    wrapper.vm.loading = false;
    wrapper.vm.isMasterProjectsChange = true;
    wrapper.vm.isEnvironmentsChange = true;
    wrapper.vm.isClientsChange = true;
    expect(wrapper.vm.canReload).toBeFalsy();

    wrapper.vm.isMasterProjectsChange = false;
    expect(wrapper.vm.canReload).toBeFalsy();

    wrapper.vm.isEnvironmentsChange = false;
    expect(wrapper.vm.canReload).toBeFalsy();

    wrapper.vm.isClientsChange = false;
    expect(wrapper.vm.canReload).toBeTruthy();

    wrapper.vm.loading = true;
    wrapper.vm.isMasterProjectsChange = true;
    wrapper.vm.isEnvironmentsChange = true;
    wrapper.vm.isClientsChange = true;
    expect(wrapper.vm.canReload).toBeTruthy();

    wrapper.vm.loading = false;
    wrapper.vm.isMasterProjectsChange = false;
    wrapper.vm.isEnvironmentsChange = false;
    wrapper.vm.isClientsChange = false;
    expect(wrapper.vm.canReload).toBeTruthy();
  });

  it('Test computed: resetVisibility', () => {
    wrapper.vm.loading = false;
    wrapper.vm.previousMasterProjects = [1, 2];
    wrapper.vm.previousEnvironments = [1, 2];
    wrapper.vm.previousClients = ['client1', 'client2'];

    expect(wrapper.vm.resetVisibility).toBeFalsy();

    wrapper.vm.loading = true;
    expect(wrapper.vm.resetVisibility).toBeTruthy();

    wrapper.vm.loading = false;
    wrapper.vm.previousMasterProjects = [1];
    expect(wrapper.vm.resetVisibility).toBeTruthy();

    wrapper.vm.previousMasterProjects = [1, 2];
    wrapper.vm.previousEnvironments = [1];
    expect(wrapper.vm.resetVisibility).toBeTruthy();

    wrapper.vm.previousEnvironments = [1, 2];
    wrapper.vm.previousClients = ['c1'];
    expect(wrapper.vm.resetVisibility).toBeTruthy();
  });

  it('Test method: getMasterProjectName', () => {
    expect(wrapper.vm.getMasterProjectName(1)).toEqual('master1');
    expect(wrapper.vm.getMasterProjectName(2)).toEqual('master2');
  });

  it('Test method: getEnvironmentName', () => {
    expect(wrapper.vm.getEnvironmentName(1)).toEqual('env1');
    expect(wrapper.vm.getEnvironmentName(2)).toEqual('env2');
  });

  it('Test method: removeMasterProject', () => {
    wrapper.vm.setMasterProjects = jest.fn();
    wrapper.vm.reloadCharts = jest.fn();

    expect(wrapper.vm.selectedMasterProjects).toEqual([1, 2]);

    wrapper.vm.removeMasterProject(2);
    expect(wrapper.vm.selectedMasterProjects).toEqual([1]);
  });

  it('Test method: removeEnvironment', () => {
    wrapper.vm.setEnvironments = jest.fn();
    wrapper.vm.reloadCharts = jest.fn();

    expect(wrapper.vm.selectedEnvironments).toEqual([1, 2]);

    wrapper.vm.removeEnvironment(2);
    expect(wrapper.vm.selectedEnvironments).toEqual([1]);
  });

  it('Test method: removeClient', () => {
    wrapper.vm.setClients = jest.fn();
    wrapper.vm.reloadCharts = jest.fn();

    expect(wrapper.vm.selectedClients).toEqual(['client1', 'client2']);

    wrapper.vm.removeClient('client2');
    expect(wrapper.vm.selectedClients).toEqual(['client1']);
  });

  it('Test method: setMasterProjects', () => {
    wrapper.vm.setMasterProjects();
    expect(wrapper.vm.selectedMasterProjects).toEqual([1, 2]);
    expect(wrapper.vm.isMasterProjectsChange).toBeFalsy();

    wrapper.vm.selectedMasterProjects = [];
    wrapper.vm.setMasterProjects();
    expect(wrapper.vm.selectedMasterProjects).toEqual([1, 2]);
    expect(wrapper.vm.isMasterProjectsChange).toBeFalsy();

    wrapper.vm.selectedMasterProjects = [1];
    wrapper.vm.setMasterProjects();
    expect(wrapper.vm.selectedMasterProjects).toEqual([1]);
    expect(wrapper.vm.isMasterProjectsChange).toBeTruthy();
  });

  it('Test method: setEnvironments', () => {
    wrapper.vm.setEnvironments();
    expect(wrapper.vm.selectedEnvironments).toEqual([1, 2]);
    expect(wrapper.vm.isEnvironmentsChange).toBeFalsy();

    wrapper.vm.selectedEnvironments = [];
    wrapper.vm.setEnvironments();
    expect(wrapper.vm.selectedEnvironments).toEqual([1, 2]);
    expect(wrapper.vm.isEnvironmentsChange).toBeFalsy();

    wrapper.vm.selectedEnvironments = [1];
    wrapper.vm.setEnvironments();
    expect(wrapper.vm.selectedEnvironments).toEqual([1]);
    expect(wrapper.vm.isEnvironmentsChange).toBeTruthy();
  });

  it('Test method: setClients', () => {
    wrapper.vm.setClients();
    expect(wrapper.vm.selectedClients).toEqual(['client1', 'client2']);
    expect(wrapper.vm.isClientsChange).toBeFalsy();

    wrapper.vm.selectedClients = [];
    wrapper.vm.setClients();
    expect(wrapper.vm.selectedClients).toEqual(['client1', 'client2']);
    expect(wrapper.vm.isClientsChange).toBeFalsy();

    wrapper.vm.selectedClients = ['client1'];
    wrapper.vm.setClients();
    expect(wrapper.vm.selectedClients).toEqual(['client1']);
    expect(wrapper.vm.isClientsChange).toBeTruthy();
  });

  it('Test method: resetFilters', () => {
    wrapper.vm.reloadCharts = jest.fn();

    wrapper.vm.selectedMasterProjects = [];
    wrapper.vm.selectedEnvironments = [];
    wrapper.vm.selectedClients = [];
    wrapper.vm.resetFilters();

    expect(wrapper.vm.selectedMasterProjects).toEqual([1, 2]);
    expect(wrapper.vm.selectedEnvironments).toEqual([1, 2]);
    expect(wrapper.vm.selectedClients).toEqual(['client1', 'client2']);
  });

  it('Test method: reloadCharts', () => {
    wrapper.vm.previousMasterProjects = [];
    wrapper.vm.previousEnvironments = [];
    wrapper.vm.previousClients = [];
    wrapper.vm.reloadCharts();

    expect(wrapper.vm.previousMasterProjects).toEqual([1, 2]);
    expect(wrapper.vm.previousEnvironments).toEqual([1, 2]);
    expect(wrapper.vm.previousClients).toEqual(['client1', 'client2']);
  });
});
