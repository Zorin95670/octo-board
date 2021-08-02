import { createLocalVue, shallowMount } from '@vue/test-utils';
import store from '@/store';
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
      store,
      mocks: {
        $route,
      },
    });
  });

  it('Test computed: login', () => {
    expect(wrapper.vm.login).toBeNull();
  });
});
