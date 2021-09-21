import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationSnackbar.vue';
import Vuetify from 'vuetify';

const localVue = createLocalVue();
const $store = {
  subscribe: jest.fn(),
};

describe('ApplicationSnackbar', () => {
  let wrapper;
  let vuetify;

  beforeAll(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $store,
      },
    });
  });

  it('Test component instantiation', () => {
    expect(wrapper).toBeTruthy();
  });

  it('Test method: onMessage', () => {
    wrapper.vm.onMessage({ type: 'bad mutation' });
    expect(wrapper.vm.timer).toBeNull();

    wrapper.vm.onMessage({ type: 'showMessage' }, {
      snackbar: {},
    });
    expect(wrapper.vm.timer).not.toBeNull();
    expect(wrapper.vm.icon).toBeNull();

    wrapper.vm.onMessage({ type: 'showMessage' }, {
      snackbar: { icon: 'test' },
    });
    expect(wrapper.vm.timer).not.toBeNull();
    expect(wrapper.vm.icon).toEqual('test');
  });

  it('Test method: onHover', () => {
    expect(wrapper.vm.hover).toBeFalsy();

    wrapper.vm.onHover(true);
    expect(wrapper.vm.hover).toBeTruthy();

    wrapper.vm.onHover(false);
    expect(wrapper.vm.hover).toBeFalsy();
  });

  it('Test method: closingInterval', () => {
    wrapper.vm.percent = 0;
    wrapper.vm.onHover(true);
    wrapper.vm.closingInterval();
    expect(wrapper.vm.percent).toEqual(0);

    wrapper.vm.onHover(false);
    wrapper.vm.closingInterval();
    expect(wrapper.vm.percent).toEqual(2);

    wrapper.vm.percent = 101;
    wrapper.vm.closingInterval();
    expect(wrapper.vm.show).toBeFalsy();
  });
});
