import { createLocalVue, shallowMount } from '@vue/test-utils';
import VersionDisplayer from '@/components/VersionDisplayer/VersionDisplayer.vue';

const localVue = createLocalVue();

describe('Home.vue', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(VersionDisplayer, {
      localVue,
      propsData: {
        platforms: ['env1', 'env2', 'env3'],
        projects: ['pro1', 'pro2'],
        versions: {
          pro1: {
            env1: '1',
            env2: '2',
            env3: '3',
          },
          pro2: {
            env1: '1',
            env2: [{
              name: 'cli1',
              version: '2',
            }, {
              name: 'cli2',
              version: '2',
            }, {
              name: 'cli3',
              version: '3',
            }],
            env3: [{
              name: 'cli1',
              version: '3',
            }],
          },
        },
      },
    });
  });

  it('Test getVersionList', () => {
    expect(wrapper.vm.getVersionList('pro1')).toEqual([{
      client: null,
      id: 'pro1_env1_1',
      platform: 'env1',
      project: 'pro1',
      size: 1,
      version: '1',
    }, {
      client: null,
      id: 'pro1_env2_2',
      platform: 'env2',
      project: 'pro1',
      size: 3,
      version: '2',
    }, {
      client: null,
      id: 'pro1_env3_3',
      platform: 'env3',
      project: 'pro1',
      size: 1,
      version: '3',
    }]);
    expect(wrapper.vm.getVersionList('pro2')).toEqual([{
      client: null,
      id: 'pro2_env1_1',
      platform: 'env1',
      project: 'pro2',
      size: 1,
      version: '1',
    }, {
      client: 'cli1',
      id: 'pro2_env2_cli1_2',
      platform: 'env2',
      project: 'pro2',
      size: 1,
      version: '2',
    }, {
      client: 'cli2',
      id: 'pro2_env2_cli2_2',
      platform: 'env2',
      project: 'pro2',
      size: 1,
      version: '2',
    }, {
      client: 'cli3',
      id: 'pro2_env2_cli3_3',
      platform: 'env2',
      project: 'pro2',
      size: 1,
      version: '3',
    }, {
      client: 'cli1',
      id: 'pro2_env3_cli1_3',
      platform: 'env3',
      project: 'pro2',
      size: 1,
      version: '3',
    }]);
  });

  it('Test getNumberOfClientByPlatform', () => {
    expect(wrapper.vm.getNumberOfClientByPlatform('env1')).toEqual(1);
    expect(wrapper.vm.getNumberOfClientByPlatform('env2')).toEqual(3);
  });

  it('Test getClass', () => {
    expect(wrapper.vm.getClass()).toEqual({});
    expect(wrapper.vm.getClass('test')).toEqual({ test: true });
    expect(wrapper.vm.getClass('test', 'test2')).toEqual({ test: true, test2: true });
  });
});
