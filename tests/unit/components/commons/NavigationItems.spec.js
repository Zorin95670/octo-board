import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/NavigationItems.vue';
import Vuetify from 'vuetify';

const localVue = createLocalVue();

describe('NavigationItems', () => {
  let wrapper;
  let vuetify;

  beforeAll(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test component instantiation', async () => {
    expect(wrapper).toBeTruthy();
  });
});
