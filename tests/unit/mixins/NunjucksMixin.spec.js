import { createLocalVue, shallowMount } from '@vue/test-utils';
import mixin from '@/mixins/NunjucksMixin';

const localVue = createLocalVue();

describe('Test NunjucksMixin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount({
      render: jest.fn(),
      mixins: [mixin],
    }, {
      localVue,
    });
  });

  it('Test component instantiation', () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.renderString).not.toBeNull();
  });
});
