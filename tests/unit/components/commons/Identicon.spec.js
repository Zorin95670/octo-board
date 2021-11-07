import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/Identicon.vue';

const localVue = createLocalVue();

describe('Identicon', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        value: 'admin',
      },
    });
  });

  it('Test default props', () => {
    expect(wrapper.vm.size).toEqual(24);
  });

  it('Test computed: identicon', () => {
    expect(wrapper.vm.identicon).not.toBeNull();
  });
});
