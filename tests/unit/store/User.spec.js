import user from '@/store/User';

describe('User', () => {
  it('Test default state', () => {
    expect(user.state).toEqual({
      isConnected: false,
      token: null,
      roles: [],
      firstname: null,
      lastname: null,
      login: null,
      email: null,
    });
  });

  it('Test mutation: setUser', () => {
    const state = {};
    user.mutations.setUser(state, {
      token: 'token',
      roles: ['test'],
      firstname: 'firstname',
      lastname: 'lastname',
      login: 'login',
      email: 'email',
    });
    expect(state).toEqual({
      isConnected: true,
      token: 'token',
      roles: ['test'],
      firstname: 'firstname',
      lastname: 'lastname',
      login: 'login',
      email: 'email',
    });
  });

  it('Test mutation: disconnect', () => {
    const state = {};
    user.mutations.disconnect(state);
    expect(state).toEqual({
      isConnected: false,
      token: null,
      roles: [],
      firstname: null,
      lastname: null,
      login: null,
      email: null,
    });
  });
});
