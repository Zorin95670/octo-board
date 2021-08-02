import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/DeploymentCard.vue';
import moment from 'moment';
import Vuetify from 'vuetify';

const localVue = createLocalVue();

describe('App.vue', () => {
  let wrapper;
  let vuetify;
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
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        deployment,
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
});
