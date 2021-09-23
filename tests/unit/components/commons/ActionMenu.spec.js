import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/ActionMenu.vue';

const localVue = createLocalVue();

describe('AlertMenu', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $router: {
          currentRoute: {
            meta: {
              hasAction: false,
            },
          },
        },
        $route: null,
      },
    });
  });

  it('Test created', () => {
    expect(wrapper.vm.actionColor).toBeNull();
    expect(wrapper.vm.actionIcon).toBeNull();
    expect(wrapper.vm.actions).toEqual([]);
  });

  it('Test method: initData', async () => {
    wrapper.vm.initData({
      hasAction: true,
      actionColor: 'color',
      actionIcon: 'icon',
      actions: ['project'],
    });
    expect(wrapper.vm.actionColor).toEqual('color');
    expect(wrapper.vm.actionIcon).toEqual('icon');
    expect(wrapper.vm.actions.length).toEqual(1);
    expect(wrapper.vm.actions[0].key).toEqual('project');

    wrapper.vm.initData({
      hasAction: false,
    });
    expect(wrapper.vm.actionColor).toBeNull();
    expect(wrapper.vm.actionIcon).toBeNull();
    expect(wrapper.vm.actions).toEqual([]);
  });
});
