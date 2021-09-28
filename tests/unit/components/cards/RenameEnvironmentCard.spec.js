import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/cards/environment/RenameEnvironmentCard.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('RenameEnvironmentCard', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        environments: [{ id: 1, name: 'test' }],
      },
      mocks: {
        $refs: {
          environmentForm: {
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

  it('Test watch: environments', async () => {
    wrapper.setProps({ environments: [] });
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.id).toBeNull();
    });
    wrapper.setProps({ environments: [{ id: 1, name: 'test' }] });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.id).toEqual(1);
    });
  });

  it('Test method: openRenameDialog', () => {
    wrapper.vm.id = 1;
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.openRenameDialog();
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: save', async () => {
    mock.onPatch('/octo-spy/api/environments/1')
      .reply(204);
    mock.onPatch('/octo-spy/api/environments/2')
      .reply(400, {
        field: 'test',
        value: 'value',
      });

    wrapper.vm.$refs.environmentForm.reset = jest.fn();
    wrapper.vm.$root.$emit = jest.fn();
    await wrapper.vm.save({ id: 2 });
    expect(wrapper.vm.$root.$emit).not.toBeCalled();
    expect(wrapper.vm.errorMessage).toEqual('Field test is value.');

    await wrapper.vm.save({ id: 1 });
    expect(wrapper.vm.$root.$emit).toBeCalled();
    expect(wrapper.vm.errorMessage).toEqual('');
  });
});
