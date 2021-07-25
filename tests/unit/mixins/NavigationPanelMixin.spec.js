import { createLocalVue, shallowMount } from '@vue/test-utils';
import mixin from '@/mixins/NavigationPanelMixin';
import store from '@/store';

const localVue = createLocalVue();

describe('Test NavigationPanelMixin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount({
      render() {},
      mixins: [mixin],
    }, {
      localVue,
      store,
    });
  });

  it('Test component instantiation', () => {
    expect(wrapper.vm.isNavigationPanelOpen).toBeFalsy();
  });

  it('Test computed: isNavigationPanelOpen', () => {
    expect(wrapper.vm.isNavigationPanelOpen).toBeFalsy();
  });

  it('Test method: openNavigationPanel', () => {
    wrapper.vm.openNavigationPanel();
    expect(wrapper.vm.isNavigationPanelOpen).toBeTruthy();
  });

  it('Test method: closeNavigationPanel', () => {
    wrapper.vm.closeNavigationPanel();
    expect(wrapper.vm.isNavigationPanelOpen).toBeFalsy();
  });

  it('Test method: setNavigationPanelState', () => {
    wrapper.vm.setNavigationPanelState(false);
    expect(wrapper.vm.isNavigationPanelOpen).toBeFalsy();

    wrapper.vm.setNavigationPanelState(true);
    expect(wrapper.vm.isNavigationPanelOpen).toBeTruthy();
  });
});
