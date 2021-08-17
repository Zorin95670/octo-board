import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/ProjectCard.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('ProjectCard', () => {
  let wrapper;
  let vuetify;
  let store;

  mock.onGet('/octo-spy/api/project/count')
    .reply(200, {
      test: 1,
      noData: 0,
    });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = {
      commit: jest.fn(),
      state: {
        user: {
          login: null,
          token: null,
          roles: [],
        },
      },
    };
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        name: 'test',
        projectId: 1,
      },
      mocks: {
        $store: store,
      },
    });
  });

  it('Test method: getTotalOfSubProject with sub-projects', async () => {
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        name: 'test',
        projectId: 1,
        isMasterProject: true,
      },
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.defaultRgbColor = wrapper.vm.rgbColor;
    await wrapper.vm.getTotalOfSubProject();

    expect(wrapper.vm.total).toEqual(1);
  });

  it('Test method: getTotalOfSubProject without sub-projects', async () => {
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        name: 'noData',
        projectId: 1,
        isMasterProject: true,
      },
      mocks: {
        $store: store,
      },
    });
    wrapper.vm.defaultRgbColor = wrapper.vm.rgbColor;
    await wrapper.vm.getTotalOfSubProject();

    expect(wrapper.vm.total).toEqual(0);
  });

  it('Test method: onProjectUpdate', () => {
    wrapper.vm.colorMenu = true;
    wrapper.vm.onProjectUpdate();


    expect(wrapper.vm.colorMenu).toBeFalsy();
    expect(wrapper.emitted().onProjectUpdate).toBeTruthy();
  });
});
