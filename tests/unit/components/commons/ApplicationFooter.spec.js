import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/commons/ApplicationFooter.vue';
import Vuetify from 'vuetify';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import VueAxios from 'vue-axios';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();
localVue.use(VueAxios, axios);

describe('ApplicationFooter', () => {
  let wrapper;
  let vuetify;

  beforeAll(() => {
    mock.onGet('/octo-spy/api/info')
      .reply(200, { version: 'test' });
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test component instantiation', async () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.version.api).toEqual('test');
  });
});
