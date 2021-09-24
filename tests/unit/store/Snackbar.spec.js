import snackbar from '@/store/Snackbar';

describe('Test Snakcbar', () => {
  it('Test default state', () => {
    expect(snackbar.state).toEqual({
      message: '',
      color: '',
      icon: null,
      timeout: null,
    });
  });

  it('Test mutation: showMessage', () => {
    const state = {};
    snackbar.mutations.showMessage(state, {
      message: '',
      color: '',
      icon: null,
      timeout: null,
    });
    expect(state).toEqual({
      message: '',
      color: '',
      icon: null,
      timeout: null,
    });
  });
});
