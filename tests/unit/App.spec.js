import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  const router = new VueRouter();
  beforeAll(() => {
    wrapper = shallowMount(App, {
      localVue,
      router,
      stubs: {
        FontAwesomeIcon: true,
      },
    });
  });

  it('Simple test', async () => {
    expect(wrapper).toBeTruthy();
  });
});
