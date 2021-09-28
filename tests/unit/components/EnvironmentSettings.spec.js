import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/EnvironmentSettings.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('EnvironmentSettings', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test method: loadEnvironments', async () => {
    const environments = [{ name: 'test', id: 1, position: 0}];
    mock.onGet('/octo-spy/api/environments')
      .reply(200, environments);
    await wrapper.vm.loadEnvironments();
    expect(wrapper.vm.environments).toEqual(environments);
  });
});
