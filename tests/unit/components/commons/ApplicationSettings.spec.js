import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationSettings.vue';

const localVue = createLocalVue();

describe('ApplicationSettings', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
    });
  });

  it('Test data', () => {
    expect(wrapper.vm.settings).not.toBeNull();
  });
});
