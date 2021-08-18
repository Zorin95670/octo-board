import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/MasterProjectCardList.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('MasterProjectCardList', () => {
  let wrapper;
  let vuetify;

  mock.onGet('/octo-spy/api/project?isMaster=true')
    .reply(200, [{}]);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
    });
  });

  it('Test method: loadProjects', async () => {
    await wrapper.vm.loadProjects();

    expect(wrapper.vm.projects).toEqual([{}]);
  });

  it('Test method: onProjectUpdate', async () => {
    await wrapper.vm.onProjectUpdate();

    expect(wrapper.vm.projects).toEqual([{}]);
  });
});
