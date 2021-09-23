import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/NewVersionsCard.vue';

const localVue = createLocalVue();

describe('NewVersionsCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $store: {
          state: {
            dialog: {
              data: true,
            },
          },
        },
      },
    });
  });

  it('Test computed: versions', () => {
    expect(wrapper.vm.versions).toBeTruthy();
  });
});
