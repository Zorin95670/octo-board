import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationBar.vue';

const localVue = createLocalVue();

const $route = {
  name: '/test',
};

describe('ApplicationBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $route,
        $store: {
          state: {
            alerts: [],
            user: {
              login: null,
              roles: [],
            },
          },
        },
      },
    });
  });

  it('Test computed: login', () => {
    expect(wrapper.vm.login).toBeNull();
  });

  it('Test computed: hasAlerts', () => {
    expect(wrapper.vm.hasAlerts).toBeFalsy();

    wrapper.vm.$store.state.alerts = [{}];
    expect(wrapper.vm.hasAlerts).toBeTruthy();
  });
});
