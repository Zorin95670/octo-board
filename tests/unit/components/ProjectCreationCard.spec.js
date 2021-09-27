import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/ProjectCreationCard.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('ProjectCreationCard', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    mock.onGet('/octo-spy/api/projects')
      .reply(200, []);

    mock.onPost('/octo-spy/api/projects')
      .reply(201);

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $refs: {
          projectForm: {
            validate: null,
            reset: null,
          },
        },
        $store: {
          commit: jest.fn(),
          state: {
            user: {
              login: null,
              token: null,
              roles: [],
            },
            dialog: {
              data: {
                isMaster: true,
              },
            },
          },
        },
      },
    });
  });

  it('Test computed: isMaster', () => {
    expect(wrapper.vm.isMaster).toBeTruthy();
  });

  it('Test rule: name', () => {
    expect(wrapper.vm.rules.name[0]())
      .toEqual('Name is required.');
    expect(wrapper.vm.rules.name[0](true))
      .toBeTruthy();
  });

  it('Test rule: project', () => {
    expect(wrapper.vm.rules.project[0]())
      .toEqual('Project is required.');
    expect(wrapper.vm.rules.project[0](true))
      .toBeTruthy();
  });

  it('Test method: loadMasterProjects', async () => {
    wrapper.vm.projects = [];

    mock.onGet('/octo-spy/api/projects')
      .reply(200, [{ name: 'test' }]);
    await wrapper.vm.loadMasterProjects();
    expect(wrapper.vm.projects).toEqual(['test']);
  });

  it('Test method: validate', async () => {
    let event = null;
    wrapper.vm.$root.$emit = (name) => { event = name; };
    wrapper.vm.$refs.projectForm.validate = () => false;
    wrapper.vm.$refs.projectForm.reset = jest.fn();
    wrapper.vm.closeDialog = jest.fn();
    wrapper.vm.errorMessage = 'test';
    await wrapper.vm.validate();
    expect(wrapper.vm.errorMessage).toEqual('');

    wrapper.vm.$refs.projectForm.validate = () => true;
    await wrapper.vm.validate();
    expect(event).toEqual('reloadMasterProject');

    wrapper.vm.$store.state.dialog.data.isMaster = false;
    await wrapper.vm.validate();
    expect(event).toEqual('reloadSubProject');

    mock.onPost('/octo-spy/api/projects')
      .reply(400, { field: 'project', value: 'test' });
    await wrapper.vm.validate();
    expect(wrapper.vm.errorMessage).toEqual('Field project is test.');
  });
});
