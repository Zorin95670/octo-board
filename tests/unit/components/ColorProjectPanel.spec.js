import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/ColorProjectPanel.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('ColorProjectPanel', () => {
  let wrapper;
  let vuetify;

  mock.onPatch('/octo-spy/api/project/1')
    .reply(204);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        projectId: 1,
        projectName: 'test',
        projectColor: null,
      },
    });
  });

  it('Test data', async () => {
    expect(wrapper.vm.rgbColor).toEqual({
      r: 63,
      g: 81,
      b: 181,
    });
    expect(wrapper.vm.defaultRgbColor).toBeNull();

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        projectId: 1,
        projectName: 'test',
        projectColor: '1,2,3',
      },
    });
    expect(wrapper.vm.rgbColor).toEqual({
      r: 1,
      g: 2,
      b: 3,
    });
    expect(wrapper.vm.defaultRgbColor).toEqual({
      r: 1,
      g: 2,
      b: 3,
    });
  });
  it('Test method: validate', async () => {
    wrapper.vm.defaultRgbColor = wrapper.vm.rgbColor;
    await wrapper.vm.validate();

    expect(wrapper.emitted().onColorUpdate).toBeFalsy();

    wrapper.vm.defaultRgbColor = null;
    await wrapper.vm.validate();

    expect(wrapper.emitted().onColorUpdate).toBeTruthy();
  });
});
