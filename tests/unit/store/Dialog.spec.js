import dialog from '@/store/Dialog';

describe('Test Dialog', () => {
  it('Test default state', () => {
    expect(dialog.state).toEqual({
      type: null,
      data: null,
    });
  });

  it('Test mutation: openDialog', () => {
    const state = {};
    dialog.mutations.openDialog(state, {
      type: 'type',
      data: {},
    });
    expect(state).toEqual({
      type: 'type',
      data: {},
    });
  });

  it('Test mutation: closeDialog', () => {
    const state = {
      type: 'type',
      data: {},
    };
    dialog.mutations.closeDialog(state);
    expect(state).toEqual({
      type: null,
      data: null,
    });
  });
});
