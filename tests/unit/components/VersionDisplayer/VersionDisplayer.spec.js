import { createLocalVue, shallowMount } from '@vue/test-utils';
import VersionDisplayer from '@/components/VersionDisplayer/VersionDisplayer.vue';

const localVue = createLocalVue();

describe('Home.vue', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(VersionDisplayer, {
      localVue,
    });
  });

  it('Simple test', () => {
    expect(wrapper).toBeTruthy();
  });

  it('Test getVersion', () => {
    expect(wrapper.vm.getVersion(null, null, null)).toBeNull();
    expect(wrapper.vm.getVersion({}, 'test', 'a')).toBeNull();
    expect(wrapper.vm.getVersion({ test: null }, 'test', 'a')).toBeNull();
    expect(wrapper.vm.getVersion({ test: { a: null } }, 'test', 'a')).toBeNull();
    expect(wrapper.vm.getVersion({ test: { a: 'b' } }, 'test', 'a')).toEqual('b');
    expect(wrapper.vm.getVersion({ test: { a: { b: 'c' } } }, 'test', 'a')).toEqual({ b: 'c' });
  });

  it('Test getMaxClientPerPlatforms', () => {
    expect(wrapper.vm.getMaxClientPerPlatforms(null)).toEqual({});
    const versions = {
      test: {
        a: 'a',
        b: [1, 2],
      },
      test2: {
        a: [],
        b: [1, 2, 3],
        c: [1, 2],
      },
    };
    expect(wrapper.vm.getMaxClientPerPlatforms(versions)).toEqual({ a: 1, b: 3, c: 2 });
  });

  it('Test getClass', () => {
    expect(wrapper.vm.getClass()).toEqual({});
    expect(wrapper.vm.getClass('test')).toEqual({ test: true });
    expect(wrapper.vm.getClass('test', 'test2')).toEqual({ test: true, test2: true });
  });
});
