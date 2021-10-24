import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import component from '@/components/commons/NavigationItems.vue';

const localVue = createLocalVue();

describe('NavigationItems', () => {
  let wrapper;
  let vuetify;

  beforeAll(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          state: {
            user: {
              isConnected: true,
              roles: [],
            },
          },
        },
      },
    });
  });

  it('Test component instantiation', async () => {
    expect(wrapper).toBeTruthy();
  });
});
