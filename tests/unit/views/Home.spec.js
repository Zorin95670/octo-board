import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Home from '@/views/Home.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('Home.vue', () => {
  let wrapper;

  mock.onGet('/octo-spy/api/deployment/last')
    .reply(200, []);
  beforeAll(() => {
    wrapper = shallowMount(Home, {
      localVue,
      stubs: {
        FontAwesomeIcon: true,
      },
    });
  });

  it('Simple test', async () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.versions).toEqual({});
  });

  it('Test create data from last deployment', async () => {
    wrapper.vm.createLastDeployments({
      data: [{
        id: 1,
        environment: 'Production',
        project: 'Harmony',
        version: '1.0.0',
        client: 'a',
      }, {
        id: 2,
        environment: 'Production',
        project: 'Harmony',
        version: '1.0.0',
        client: 'b',
      }, {
        id: 2,
        environment: 'Dev',
        project: 'Karajan',
        version: '1.0.0',
        client: 'b',
      }],
    });

    expect(wrapper.vm.versions).toEqual({
      Harmony: {
        Production: [{
          name: 'a',
          version: '1.0.0',
        }, {
          name: 'b',
          version: '1.0.0',
        }],
      },
      Karajan: {
        Dev: '1.0.0',
      },
    });
  });
});
