import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mixin from '@/mixins/AuthenticationMixin';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('Test AuthenticationMixin', () => {
  let wrapper;
  let $router;
  beforeEach(() => {
    $router = { push: jest.fn() };
    wrapper = shallowMount({
      render: jest.fn(),
      mixins: [mixin],
    }, {
      localVue,
      mocks: {
        $router,
        $store: {
          commit: jest.fn(),
          dispatch: jest.fn(),
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

  it('Test computed: isConnected', () => {
    expect(wrapper.vm.isConnected)
      .toBeFalsy();
  });

  it('Test computed: roles', () => {
    expect(wrapper.vm.roles)
      .toEqual([]);
  });

  it('Test method: isUserGranted', () => {
    expect(wrapper.vm.isUserGranted([]))
      .toBeFalsy();
    expect(wrapper.vm.isUserGranted(['test']))
      .toBeFalsy();
    wrapper.vm.$store.state.user.roles = ['test'];
    expect(wrapper.vm.isUserGranted(['test']))
      .toBeTruthy();
  });

  it('Test method: authenticate, success admin', async () => {
    mock.onGet('/octo-spy/api/users/me')
      .reply(200, {
        roles: ['ADMIN'],
        user: {
          login: 'a',
          firstname: 'b',
          lastname: 'c',
          email: 'd',
          active: true,
        },
      });
    const storage = {
      removeItem: jest.fn(),
      setItem: jest.fn(),
    };
    wrapper.vm.loadAlerts = jest.fn();

    await wrapper.vm.authenticate(storage, 'token');
    expect(storage.removeItem).toBeCalled();
    expect(wrapper.vm.loadAlerts).toBeCalled();

    await wrapper.vm.authenticate(storage, 'token', false);
    expect(storage.removeItem).toBeCalled();
    expect(wrapper.vm.loadAlerts).toBeCalled();

    await wrapper.vm.authenticate(storage, 'token', true);
    expect(storage.setItem).toBeCalled();
    expect(wrapper.vm.loadAlerts).toBeCalled();
  });

  it('Test method: authenticate, success no admin', async () => {
    mock.onGet('/octo-spy/api/users/me')
      .reply(200, {
        roles: ['test'],
        user: {
          login: 'a',
          firstname: 'b',
          lastname: 'c',
          email: 'd',
          active: true,
        },
      });
    const storage = {
      removeItem: jest.fn(),
      setItem: jest.fn(),
    };

    await wrapper.vm.authenticate(storage, 'token');
    expect(storage.removeItem).toBeCalled();

    await wrapper.vm.authenticate(storage, 'token', false);
    expect(storage.removeItem).toBeCalled();

    await wrapper.vm.authenticate(storage, 'token', true);
    expect(storage.setItem).toBeCalled();
  });

  it('Test method: authenticate, failed', async () => {
    mock.onGet('/octo-spy/api/users/me')
      .reply(403, {
        message: 'failed',
      });

    await wrapper.vm.authenticate('token').then((response) => {
      expect(response).not.toBeNull();
    });
  });

  it('Test method: authenticateFromStorage', async () => {
    wrapper.vm.authenticate = jest.fn(() => Promise.reject());

    const storage = {
      removeItem: jest.fn(),
      getItem: jest.fn(() => null),
    };
    wrapper.vm.authenticateFromStorage(storage);
    expect(wrapper.vm.authenticate).not.toBeCalled();

    storage.getItem = jest.fn(() => 'test');
    wrapper.vm.authenticateFromStorage(storage);
    expect(wrapper.vm.authenticate).toBeCalled();
  });

  it('Test method: disconnect', () => {
    const storage = {
      removeItem: jest.fn(),
      getItem: jest.fn(() => null),
    };

    wrapper.vm.$route = { path: '/test' };
    wrapper.vm.disconnect(storage);
    expect(storage.getItem).toBeCalled();
    expect(storage.removeItem).not.toBeCalled();

    wrapper.vm.$route = { path: '/' };
    storage.getItem = jest.fn(() => 'test');
    wrapper.vm.disconnect(storage);
    expect(storage.getItem).toBeCalled();
    expect(storage.removeItem).toBeCalled();
  });

  it('Test method: updateToken', () => {
    const storage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    };

    wrapper.vm.updateToken(storage, 'token');
    expect(storage.getItem).toBeCalled();
    expect(storage.setItem).not.toBeCalled();

    storage.getItem = jest.fn(() => true);
    wrapper.vm.updateToken(storage, 'token');
    expect(storage.getItem).toBeCalled();
    expect(storage.setItem).toBeCalled();
  });
});
