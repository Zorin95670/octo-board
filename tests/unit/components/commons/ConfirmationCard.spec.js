import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ConfirmationCard.vue';

const localVue = createLocalVue();

describe('ConfirmationCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $store: {
          state: {
            dialog: {
              data: {
                text: 'text',
                event: 'event',
                eventData: {},
              },
            },
          },
        },
      },
    });
  });

  it('Test computed: text', () => {
    expect(wrapper.vm.text).toEqual('text');
  });

  it('Test computed: event', () => {
    expect(wrapper.vm.event).toEqual('event');
  });

  it('Test computed: eventData', () => {
    expect(wrapper.vm.eventData).toEqual({});
  });

  it('Test method: validate', () => {
    wrapper.vm.$root.$emit = jest.fn();
    wrapper.vm.closeDialog = jest.fn();

    wrapper.vm.$store.state.dialog.data.event = null;
    wrapper.vm.validate();
    expect(wrapper.vm.$root.$emit).not.toBeCalled();
    expect(wrapper.vm.closeDialog).toBeCalledTimes(1);

    wrapper.vm.$store.state.dialog.data.event = 'event';
    wrapper.vm.validate();
    expect(wrapper.vm.$root.$emit).toBeCalled();
    expect(wrapper.vm.closeDialog).toBeCalledTimes(2);
  });
});
