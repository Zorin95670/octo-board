import { createLocalVue, shallowMount } from '@vue/test-utils';
import mixin from '@/mixins/UrlMixin';

const localVue = createLocalVue();

describe('Test UrlMixin', () => {
  let wrapper;
  let $router;
  beforeEach(() => {
    $router = { replace: jest.fn() };
    wrapper = shallowMount({
      render: jest.fn(),
      mixins: [mixin],
    }, {
      localVue,
      mocks: {
        $router,
        $route: {
          query: {},
        },
      },
    });
  });

  it('Test method: setUrlQueryParameters', () => {
    wrapper.vm.setUrlQueryParameters({});
    expect($router.replace).not.toBeCalled();
    wrapper.vm.setUrlQueryParameters({ test: 'test' }, ['test']);
    expect($router.replace).not.toBeCalled();
    wrapper.vm.setUrlQueryParameters({ test: 'test' }, []);
    expect($router.replace).toBeCalledTimes(1);
    expect($router.replace.mock.calls[0][0]).toEqual({ query: { test: 'test' } });
  });

  it('Test method: initDataFromQuery', () => {
    wrapper.vm.test = null;
    wrapper.vm.$route.query = { test: 'test' };

    wrapper.vm.initDataFromQuery();
    expect(wrapper.vm.test).toBeNull();

    wrapper.vm.initDataFromQuery('test');
    expect(wrapper.vm.test).toEqual('test');

    wrapper.vm.initDataFromQuery('test', { test: () => true });
    expect(wrapper.vm.test).toBeTruthy();
  });
});
