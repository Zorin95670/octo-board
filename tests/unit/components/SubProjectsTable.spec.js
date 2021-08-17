import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import component from '@/components/SubProjectsTable.vue';

const localVue = createLocalVue();

describe('SubProjectsTable', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $route: {
          params: {
            projectName: 'test',
          },
        },
      },
    });
  });

  it('Test computed: name', () => {
    expect(wrapper.vm.name).toEqual('test');
  });
});
