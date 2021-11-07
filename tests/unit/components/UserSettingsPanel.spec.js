import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import component from '@/components/UserSettingsPanel.vue';

const localVue = createLocalVue();

describe('UserSettingsPanel', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          state: {
            user: {
              firstname: 'John',
              lastname: 'Doe',
              email: 'john.doe@mail.com',
            },
          },
        },
      },
    });
  });

  it('Test computed: firstname', () => {
    expect(wrapper.vm.firstname).toEqual('John');
  });

  it('Test computed: lastname', () => {
    expect(wrapper.vm.lastname).toEqual('Doe');
  });

  it('Test computed: email', () => {
    expect(wrapper.vm.email).toEqual('john.doe@mail.com');
  });

  it('Test method: exit', () => {
    wrapper.vm.disconnect = jest.fn();
    wrapper.vm.exit();
    expect(wrapper.vm.disconnect).toBeCalled();
  });
});
