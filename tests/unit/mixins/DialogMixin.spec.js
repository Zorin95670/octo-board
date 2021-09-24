import { createLocalVue, shallowMount } from '@vue/test-utils';
import mixin from '@/mixins/DialogMixin';

const localVue = createLocalVue();

describe('Test DialogMixin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount({
      render: jest.fn(),
      mixins: [mixin],
    }, {
      localVue,
      mocks: {
        $store: {
          commit: jest.fn(),
        },
      },
    });
  });

  it('Test method: openDialog', () => {
    wrapper.vm.openDialog('test');
    wrapper.vm.openDialog('test', 'test');
    expect(wrapper.vm.$store.commit).toBeCalledTimes(2);
  });

  it('Test method: closeDialog', () => {
    wrapper.vm.closeDialog();
    expect(wrapper.vm.$store.commit).toBeCalledTimes(1);
  });
});
