import { createLocalVue, shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

const localVue = createLocalVue();

describe('Home.vue', () => {
  let wrapper;
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
  });
});
