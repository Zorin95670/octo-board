import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/AlertMenu.vue';
import alertConfig from '@/assets/alert.config.json';

const localVue = createLocalVue();

describe('AlertMenu', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $store: {
          state: {
            alerts: [],
          },
        },
      },
    });
  });

  it('Test computed: icons', () => {
    expect(wrapper.vm.icons).not.toBeNull();
  });

  it('Test computed: alerts', () => {
    expect(wrapper.vm.alerts).toEqual([]);
    wrapper.vm.$store.state.alerts = [0];
    expect(wrapper.vm.alerts).toEqual([0]);
  });

  it('Test computed: menuColor', () => {
    expect(wrapper.vm.menuColor).toEqual(alertConfig.color.warning);

    wrapper.vm.$store.state.alerts = [{ severity: 'warning' }];
    expect(wrapper.vm.menuColor).toEqual(alertConfig.color.warning);

    wrapper.vm.$store.state.alerts = [{ severity: 'warning' }, { severity: 'critical' }];
    expect(wrapper.vm.menuColor).toEqual(alertConfig.color.critical);
  });

  it('Test computed: criticalAlerts', () => {
    expect(wrapper.vm.criticalAlerts).toEqual([]);

    wrapper.vm.$store.state.alerts = [{ severity: 'warning' }];
    expect(wrapper.vm.criticalAlerts).toEqual([]);

    wrapper.vm.$store.state.alerts = [{ severity: 'warning' }, { severity: 'critical' }];
    expect(wrapper.vm.criticalAlerts).toEqual([{ severity: 'critical' }]);
  });

  it('Test computed: warningAlerts', () => {
    expect(wrapper.vm.warningAlerts).toEqual([]);

    wrapper.vm.$store.state.alerts = [{ severity: 'critical' }];
    expect(wrapper.vm.warningAlerts).toEqual([]);

    wrapper.vm.$store.state.alerts = [{ severity: 'warning' }, { severity: 'critical' }];
    expect(wrapper.vm.warningAlerts).toEqual([{ severity: 'warning' }]);
  });
});
