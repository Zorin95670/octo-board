import { createLocalVue, shallowMount } from '@vue/test-utils';
import moment from 'moment';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import component from '@/components/DeploymentCard.vue';
import store from '@/store';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('App.vue', () => {
  let wrapper;
  let vuetify;
  let $router;
  const format = 'YYYY-MM-DD HH:mm:ss';
  const deployment = {
    color: 'red',
    client: 'sfr',
    version: '1',
    inProgress: true,
    insertDate: '2020/01/01 01:01:01',
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    $router = { push: jest.fn() };

    mock.onDelete('/octo-spy/api/deployment/progress')
      .reply(204);

    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        deployment,
      },
      store,
      mocks: {
        $router,
      },
    });
  });

  it('Test computed: insertDate', () => {
    expect(wrapper.vm.insertDate)
      .not
      .toBeNull();
  });

  it('Test computed: isNew', async () => {
    await wrapper.setProps({
      deployment: {
        ...deployment,
        insertDate: moment().format(format),
      },
    });
    expect(wrapper.vm.isNew).toBeTruthy();
  });

  it('Test method: stopProgress', async () => {
    wrapper.vm.progressLoading = true;
    wrapper.vm.confirmationDialog = true;
    wrapper.vm.inProgress = true;

    await wrapper.vm.stopProgress();

    expect(wrapper.vm.progressLoading).toBeFalsy();
    expect(wrapper.vm.confirmationDialog).toBeFalsy();
    expect(wrapper.vm.inProgress).toBeFalsy();
  });
});
