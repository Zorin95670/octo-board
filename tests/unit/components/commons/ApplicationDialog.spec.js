import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationDialog.vue';

const localVue = createLocalVue();

describe('ApplicationBar', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = {
      subscribe: jest.fn(),
    };
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $store: store,
      },
    });
  });

  it('Test created', () => {
    expect(store.subscribe).toBeCalledTimes(1);
  });

  it('Test methods: onMessage', () => {
    wrapper.vm.onMessage({ type: null });
    expect(wrapper.vm.dialog).toBeFalsy();
    expect(wrapper.vm.component).toBeNull();
    wrapper.vm.onMessage({ type: 'openDialog' }, { dialog: { type: 'confirmationCard' } });
    expect(wrapper.vm.dialog).toBeTruthy();
    expect(wrapper.vm.component).not.toBeNull();
    wrapper.vm.onMessage({ type: 'closeDialog' });
    expect(wrapper.vm.dialog).toBeFalsy();
    expect(wrapper.vm.component).toBeNull();
  });
});
