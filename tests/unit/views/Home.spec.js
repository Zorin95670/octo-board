import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueAxios from 'vue-axios';
import axios from 'axios';
import moment from 'moment';
import MockAdapter from 'axios-mock-adapter';
import Home from '@/views/Home.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('Home.vue', () => {
  let wrapper;

  mock.onGet('/octo-spy/api/deployment/last')
    .reply(200, [{
      environment: 'env1',
      project: 'Harmony',
      version: '1.0.0',
      client: 'TF1',
    }, {
      environment: 'env2',
      project: 'Harmony',
      version: '2.0.0',
      client: 'TF1',
    }]);
  mock.onGet('/octo-spy/api/environment')
    .reply(200, [{ name: 'env1' }, { name: 'env2' }]);
  beforeAll(() => {
    wrapper = shallowMount(Home, {
      localVue,
      stubs: {
        FontAwesomeIcon: true,
      },
    });
  });

  it('Simple test', async () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.versions).toEqual({
      Harmony: {
        env1: [{ name: 'TF1', version: '1.0.0', class: '' }],
        env2: [{ name: 'TF1', version: '2.0.0', class: '' }],
      },
    });
    expect(wrapper.vm.environments).toEqual(['env1', 'env2']);
    expect(wrapper.vm.projects).toEqual(['Harmony']);
  });

  it('Test create data from last deployment', async () => {
    wrapper.vm.createLastDeployments({
      data: [{
        id: 1,
        environment: 'Production',
        project: 'Harmony',
        version: '1.0.0',
        client: 'a',
      }, {
        id: 2,
        environment: 'Production',
        project: 'Harmony',
        version: '1.0.0',
        client: 'b',
      }, {
        id: 2,
        environment: 'Dev',
        project: 'Karajan',
        version: '1.0.0',
        client: 'b',
      }],
    });

    expect(wrapper.vm.versions).toEqual({
      Harmony: {
        Production: [{
          name: 'a',
          version: '1.0.0',
          class: '',
        }, {
          name: 'b',
          version: '1.0.0',
          class: '',
        }],
      },
      Karajan: {
        Dev: [{ name: 'b', version: '1.0.0', class: '' }],
      },
    });
  });
  it('Test hot and new', () => {
    expect(wrapper.vm.getClass(null)).toEqual('');
    let date = moment().utc().subtract(2, 'days');
    expect(wrapper.vm.getClass(date.format('YYYY-MM-DD HH:mm:ss'))).toEqual('');
    date = moment().utc().subtract(2, 'hour');
    expect(wrapper.vm.getClass(date.format('YYYY-MM-DD HH:mm:ss'))).toEqual('new');
    date = moment().utc();
    expect(wrapper.vm.getClass(date.format('YYYY-MM-DD HH:mm:ss'))).toEqual('hot-new');
  });
});
