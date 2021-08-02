import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/AuthenticationPanel.vue';
import Vuetify from 'vuetify';

const localVue = createLocalVue();

describe('AuthenticationPanel', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test data: rules.login', () => {
    expect(wrapper.vm.rules.login[0]('test')).toBeTruthy();
    expect(wrapper.vm.rules.login[0](null)).toEqual('Login is required');
  });

  it('Test data: rules.password', () => {
    expect(wrapper.vm.rules.password[0]('test')).toBeTruthy();
    expect(wrapper.vm.rules.password[0](null)).toEqual('Password is required');
  });

  it('Test method: validate', async () => {
    const spyAuthenticate = jest.fn(() => Promise.resolve());
    wrapper.vm.authenticate = spyAuthenticate;

    wrapper.vm.$refs.form.validate = jest.fn(() => false);
    wrapper.vm.validate();
    expect(spyAuthenticate).not.toBeCalled();

    wrapper.vm.loading = true;
    wrapper.vm.$refs.form.validate = jest.fn(() => true);
    await wrapper.vm.validate();
    expect(spyAuthenticate).toBeCalled();
    expect(wrapper.vm.loading).toBeFalsy();
  });
});
