import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/cards/environment/CreateEnvironmentCard.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('CreateEnvironmentCard', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
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

  it('Test method: save', async () => {
    wrapper.vm.$root.$emit = jest.fn();
    wrapper.vm.$refs.environmentForm.validate = () => false;
    wrapper.vm.$refs.environmentForm.reset = jest.fn();
    wrapper.vm.errorMessage = 'test';
    await wrapper.vm.save();
    expect(wrapper.vm.errorMessage).toEqual('');


    wrapper.vm.$refs.environmentForm.validate = () => true;
    mock.onPost('/octo-spy/api/environments')
      .reply(400, {
        field: 'test',
        value: 'value',
      });
    await wrapper.vm.save();
    expect(wrapper.vm.$root.$emit).not.toBeCalled();
    expect(wrapper.vm.errorMessage).toEqual('Field test is value.');


    mock.onPost('/octo-spy/api/environments')
      .reply(201);
    await wrapper.vm.save();
    expect(wrapper.vm.$root.$emit).toBeCalled();
    expect(wrapper.vm.errorMessage).toEqual('');
  });
});
