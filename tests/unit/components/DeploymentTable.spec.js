import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/DeploymentTable.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('DeploymentTable', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    mock.onGet('/octo-spy/api/environments')
      .reply(200, ['env1', 'env2']);

    mock.onGet('/octo-spy/api/deployments/last')
      .reply(200, []);

    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test created: init params', () => {
    expect(wrapper.vm.params)
      .toEqual({
        onMasterProject: true,
      });

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        masterProject: 'Test',
      },
    });

    expect(wrapper.vm.params)
      .toEqual({
        masterProject: 'Test',
        onMasterProject: false,
        name: 'not_Test',
      });
  });

  it('Test method: initProjects', () => {
    expect(wrapper.vm.initProjects([{
      projectId: 1,
      project: 'Project 1',
      color: null,
    }, {
      projectId: 1,
      project: 'Project 1',
      color: null,
    }, {
      projectId: 2,
      project: 'Project 2',
      color: 'red',
    }]))
      .toEqual([{
        id: 1,
        name: 'Project 1',
        color: '63,81,181',
      }, {
        id: 2,
        name: 'Project 2',
        color: 'red',
      }]);
  });
  it('Test method: initEnvironments', () => {
    const projects = [{
      id: 1,
      name: 'pro1',
      color: '63,81,181',
    }, {
      id: 2,
      name: 'pro2',
      color: 'red',
    }];
    const environmentNames = [{ name: 'env1' }, { name: 'env2' }];
    expect(wrapper.vm.initEnvironments(projects, [{
      projectId: 1,
      environment: 'env1',
      client: 'cli1',
    }], environmentNames))
      .toEqual([{
        clients: {
          pro1: ['cli1'],
          pro2: [],
        },
        maxClients: 1,
        name: 'env1',
      }]);
    expect(wrapper.vm.initEnvironments(projects, [{
      projectId: 1,
      environment: 'env1',
      client: 'cli1',
    }, {
      projectId: 1,
      environment: 'env1',
      client: 'cli2',
    }, {
      projectId: 2,
      environment: 'env1',
      client: 'cli3',
    }, {
      projectId: 2,
      environment: 'env2',
      client: 'cli4',
    }], environmentNames))
      .toEqual([{
        clients: {
          pro1: ['cli1', 'cli2'],
          pro2: ['cli3'],
        },
        maxClients: 2,
        name: 'env1',
      }, {
        clients: {
          pro1: [],
          pro2: ['cli4'],
        },
        maxClients: 1,
        name: 'env2',
      }]);
  });
  it('Test method: initTableData', () => {
    const environments = [{ name: 'env1' }, { name: 'env2' }];

    expect(wrapper.vm.initTableData([{
      projectId: 1,
      project: 'pro1',
      environment: 'env1',
      client: 'cli1',
    }, {
      projectId: 1,
      project: 'pro1',
      environment: 'env1',
      client: 'cli2',
    }, {
      projectId: 2,
      project: 'pro2',
      environment: 'env1',
      client: 'cli3',
    }, {
      projectId: 2,
      project: 'pro2',
      environment: 'env2',
      client: 'cli4',
      color: 'red',
    }], environments)).toEqual({
      pro1: {
        env1: {
          cli1: {
            client: 'cli1',
            color: '63,81,181',
            colorIndex: 1,
            environment: 'env1',
            project: 'pro1',
            projectId: 1,
          },
          cli2: {
            client: 'cli2',
            color: '63,81,181',
            colorIndex: 1,
            environment: 'env1',
            project: 'pro1',
            projectId: 1,
          },
        },
      },
      pro2: {
        env1: {
          cli3: {
            client: 'cli3',
            color: '63,81,181',
            colorIndex: 1,
            environment: 'env1',
            project: 'pro2',
            projectId: 2,
          },
        },
        env2: {
          cli4: {
            client: 'cli4',
            color: 'red',
            colorIndex: 2,
            environment: 'env2',
            project: 'pro2',
            projectId: 2,
          },
        },
      },
    });
  });

  it('Test method: onProjectUpdate', async () => {
    await wrapper.vm.onProjectUpdate();

    expect(wrapper.vm.projects).toEqual([]);
  });
});
