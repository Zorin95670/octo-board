import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationBar.vue';

const localVue = createLocalVue();

const $route = {
  name: '/test',
};

describe('ApplicationBar', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $route,
      },
    });
  });

  it('Test component instantiation', () => {
    expect(wrapper).toBeTruthy();
  });
});
