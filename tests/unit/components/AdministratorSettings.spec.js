import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/AdministratorSettings.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('AdministratorSettings', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $refs: {
          administratorPasswordForm: {},
          administratorEmailForm: {},
        },
        $store: {
          commit: jest.fn(),
          state: {
            user: {
              login: null,
              token: null,
              roles: [],
            },
          },
        },
      },
    });
  });

  it('Test computed: login', () => {
    expect(wrapper.vm.login).toBeNull();
  });

  it('Test computed: user', () => {
    expect(wrapper.vm.user).not.toBeNull();
  });

  it('Test rules: password required', () => {
    const error = 'Password is required.';
    expect(wrapper.vm.rules.password[0](null)).toEqual(error);
    expect(wrapper.vm.rules.password[0]('')).toBeTruthy();
  });

  it('Test rules: password length', () => {
    const error = 'Password size must be between 8 and 50 characters.';
    expect(wrapper.vm.rules.password[1]('')).toEqual(error);
    expect(wrapper.vm.rules.password[1](new Array(8).join('a'))).toEqual(error);
    expect(wrapper.vm.rules.password[1](new Array(52).join('a'))).toEqual(error);
    expect(wrapper.vm.rules.password[1](new Array(9).join('a'))).toBeTruthy();
    expect(wrapper.vm.rules.password[1](new Array(51).join('a'))).toBeTruthy();
  });

  it('Test rules: passwordConfirmation required', () => {
    const error = 'Password confirmation is required.';
    expect(wrapper.vm.rules.passwordConfirmation[0](null)).toEqual(error);
    expect(wrapper.vm.rules.passwordConfirmation[0]('')).toBeTruthy();
  });

  it('Test rules: passwordConfirmation same as password', () => {
    const error = 'Different to password.';
    expect(wrapper.vm.rules.passwordConfirmation[1](null)).toEqual(error);
    expect(wrapper.vm.rules.passwordConfirmation[1]('test')).toEqual(error);
    wrapper.vm.password = 'test';
    expect(wrapper.vm.rules.passwordConfirmation[1]('test')).toBeTruthy();
  });

  it('Test rules: email required', () => {
    const error = 'E-mail is required.';
    expect(wrapper.vm.rules.email[0](null)).toEqual(error);
    expect(wrapper.vm.rules.email[0]('')).toBeTruthy();
  });

  it('Test rules: email valid', () => {
    const error = 'E-mail must be valid.';
    expect(wrapper.vm.rules.email[1]('')).toEqual(error);
    expect(wrapper.vm.rules.email[1]('aaaa')).toEqual(error);
    expect(wrapper.vm.rules.email[1]('a@test.com')).toBeTruthy();
  });

  it('Test method: administratorPasswordValidation', async () => {
    wrapper.vm.password = 'password';
    mock.onPut('/octo-spy/api/administrator/password')
      .reply(204);
    wrapper.vm.updateToken = jest.fn();
    wrapper.vm.$refs.administratorPasswordForm.validate = () => false;
    wrapper.vm.$refs.administratorPasswordForm.reset = jest.fn();

    wrapper.vm.administratorPasswordValidation();
    expect(wrapper.vm.$store.commit).not.toBeCalled();

    wrapper.vm.$refs.administratorPasswordForm.validate = () => true;
    wrapper.vm.$store.state.user.login = 'login';
    await wrapper.vm.administratorPasswordValidation();
    expect(wrapper.vm.updateToken).not.toBeCalled();

    wrapper.vm.$store.state.user.login = 'admin';
    wrapper.vm.$store.state.user.token = 'test';
    wrapper.vm.updateToken = jest.fn();
    await wrapper.vm.administratorPasswordValidation();
    expect(wrapper.vm.$store.state.user.token).toEqual('test');
  });

  it('Test method: administratorEmailValidation', async () => {
    wrapper.vm.email = 'email';
    mock.onPut('/octo-spy/api/administrator/email')
      .reply(204);
    wrapper.vm.updateToken = jest.fn();
    wrapper.vm.$refs.administratorEmailForm.validate = () => false;
    wrapper.vm.$refs.administratorEmailForm.reset = jest.fn();
    wrapper.vm.$store.commit = jest.fn();

    wrapper.vm.administratorEmailValidation();
    expect(wrapper.vm.$store.commit).not.toBeCalled();

    wrapper.vm.$refs.administratorEmailForm.validate = () => true;
    await wrapper.vm.administratorEmailValidation();
  });
});
