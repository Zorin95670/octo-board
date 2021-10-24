import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';
import App from '@/App.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  let vuetify;
  const router = new VueRouter();

  mock.onGet('/octo-spy/api/info')
    .reply(200, { version: 'test' });

  mock.onGet('/changelog.json')
    .reply(200, []);

  beforeAll(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(App, {
      localVue,
      router,
      vuetify,
      mixins: [{
        methods: {
          authenticateFromStorage: jest.fn(),
        },
      }],
      mocks: {
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

  it('Simple test', async () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.version.api).toEqual('test');
  });

  it('Test method: manageVersions', () => {
    let versions = null;
    let version = null;

    const setItem = (name, data) => { version = data; };
    wrapper.vm.openDialog = jest.fn((name, array) => { versions = array; });

    wrapper.vm.manageVersions({
      getItem: () => '2.7.0',
      setItem,
    }, []);
    expect(wrapper.vm.openDialog).not.toBeCalled();
    wrapper.vm.manageVersions({
      getItem: () => '2.7.0',
      setItem,
    }, [{ version: '2.7.0' }]);
    expect(wrapper.vm.openDialog).not.toBeCalled();
    wrapper.vm.manageVersions({
      getItem: () => '2.7.0',
      setItem,
    }, [{ version: '2.7.1' }]);
    expect(wrapper.vm.openDialog).toBeCalled();
    expect(versions).toEqual([{ version: '2.7.1' }]);
    expect(version).toEqual('2.7.1');
  });
});
