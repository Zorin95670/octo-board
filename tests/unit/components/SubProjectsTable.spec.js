import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/SubProjectsTable.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('SubProjectsTable', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    mock.onGet('/octo-spy/api/projects')
      .reply(200, {
        content: [{
          id: 1,
          name: 'test',
        }, {
          id: 2,
          name: 'undeployProject',
        }],
      });
    mock.onGet('/octo-spy/api/deployments/count')
      .reply(200, {
        test: 1,
      });

    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $route: {
          params: {
            masterProjectName: 'test',
          },
        },
        $router: {
          push: jest.fn(),
        },
        $store: {
          commit: jest.fn(),
          state: {
            user: {
              login: null,
              token: null,
              roles: [],
            },
          },
        },
      },
    });
  });

  it('Test computed: name', () => {
    expect(wrapper.vm.name).toEqual('test');
  });

  it('Test reloadProject on root event', async () => {
    wrapper.vm.loadProjects = jest.fn();
    await wrapper.vm.$root.$emit('reloadSubProject', 'bad');
    expect(wrapper.vm.loadProjects).not.toBeCalled();

    await wrapper.vm.$root.$emit('reloadSubProject', 'test');
    expect(wrapper.vm.loadProjects).toBeCalled();
  });

  it('Test method: loadProjects', async () => {
    await wrapper.vm.loadProjects();
    expect(wrapper.vm.projects).toEqual([{
      id: 1,
      name: 'test',
    }, {
      id: 2,
      name: 'undeployProject',
    }]);
    expect(wrapper.vm.deployProjects).toEqual(['test']);
    expect(wrapper.vm.undeployProjects).toEqual(['undeployProject']);
  });

  it('Test method: openConfirmationDialog', () => {
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.openConfirmationDialog();
    expect(wrapper.vm.openDialog).toBeCalled();

    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.openConfirmationDialog('test', true);
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: deleteProject', async () => {
    mock.onDelete('/octo-spy/api/projects/1')
      .reply(200, {});
    mock.onDelete('/octo-spy/api/projects/2')
      .reply(200, {});
    wrapper.vm.loadProjects = jest.fn();
    wrapper.vm.projects = [{
      name: 'bad',
    }, {
      name: 'test',
      id: 1,
    }];
    await wrapper.vm.deleteProject('test');
    expect(wrapper.vm.loadProjects).toBeCalledTimes(1);
    expect(wrapper.vm.$router.push).not.toBeCalled();

    wrapper.vm.projects = [{
      name: 'masterTest',
      id: 2,
      isMaster: true,
    }];
    await wrapper.vm.deleteProject('masterTest');
    expect(wrapper.vm.loadProjects).toBeCalledTimes(1);
    expect(wrapper.vm.$router.push).toBeCalled();
  });
});
