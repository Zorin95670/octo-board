import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/TokenManagementPanel.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('TokenManagementPanel.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    mock.onGet('/octo-spy/api/users/token')
      .reply(200, []);

    mock.onPost('/octo-spy/api/users/token')
      .reply(200, { token: 'token' });

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      mocks: {
        $refs: {
          tokenForm: {
            validate: null,
            reset: null,
          },
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

  it('Test rules', () => {
    expect(wrapper.vm.rules[0]())
      .toEqual('Name is required.');
    expect(wrapper.vm.rules[0](true))
      .toBeTruthy();
  });

  it('Test method: loadTokens', async () => {
    expect(wrapper.vm.tokens).toEqual([]);

    mock.onGet('/octo-spy/api/users/token')
      .reply(200, { content: ['token1'] });
    await wrapper.vm.loadTokens();
    expect(wrapper.vm.tokens).toEqual(['token1']);
  });

  it('Test method: saveToken', async () => {
    wrapper.vm.$refs.tokenForm.validate = () => false;
    wrapper.vm.$refs.tokenForm.reset = jest.fn();
    wrapper.vm.errorMessage = 'test';
    await wrapper.vm.saveToken();
    expect(wrapper.vm.errorMessage).toEqual('');

    wrapper.vm.$refs.tokenForm.validate = () => true;
    wrapper.vm.loadTokens = jest.fn();
    await wrapper.vm.saveToken();
    expect(wrapper.vm.loadTokens).toBeCalled();

    mock.onPost('/octo-spy/api/users/token')
      .reply(400, { field: 'token', value: 'test' });
    await wrapper.vm.saveToken();
    expect(wrapper.vm.errorMessage).toEqual('Field token is test.');
  });

  it('Test method: setDeletedToken', () => {
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.setDeletedToken();
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: deleteToken', async () => {
    wrapper.vm.loadTokens = jest.fn();

    mock.onDelete('/octo-spy/api/users/token/test')
      .reply(200);
    await wrapper.vm.deleteToken('test');
    expect(wrapper.vm.loadTokens).toBeCalled();
  });
});
