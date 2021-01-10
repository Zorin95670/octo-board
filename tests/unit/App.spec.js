import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  const router = new VueRouter();

  mock.onGet('/octo-spy/api/info')
    .reply(200, { version: 'test' });

  beforeAll(() => {
    wrapper = shallowMount(App, {
      localVue,
      router,
      stubs: {
        FontAwesomeIcon: true,
        VueSnotify: true,
        RouterView: true,
      },
    });
  });

  it('Simple test', async () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.version.api).toEqual('test');
  });
});
