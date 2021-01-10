import {createLocalVue, shallowMount} from '@vue/test-utils';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ProjectDeploymentsHistoric from '@/views/ProjectDeploymentsHistoric.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

const $route = {
  params: {
    projectName: 'test',
  },
};

mock.onGet('/octo-spy/api/deployment')
  .reply(200, {
    total: 0,
    page: 0,
    count: 0,
    resources: [],
  });

describe('ProjectDeploymentsHistoric.vue', () => {
  let wrapper;
  let counter;

  beforeAll(() => {
    counter = {
      warning: 0,
      error: 0,
      push: 0,
    };
    wrapper = shallowMount(ProjectDeploymentsHistoric, {
      localVue,
      stubs: {
        AwesomeTable: true,
        FontAwesomeIcon: true,
        RouterLink: true,
      },
      mocks: {
        $route,
        $router: {
          push() {
            counter.push += 1;
          },
        },
        $snotify: {
          warning() {
            counter.warning += 1;
            return {
              on(name, cb) {
                cb();
              },
            };
          },
          error() {
            counter.error += 1;
          },
        },
      },
    });
  });

  it('Test success load, no data with redirection.', () => {
    expect(wrapper.vm.filters.project.value).toEqual('test');
    expect(counter).toEqual({ warning: 1, error: 0, push: 1 });
  });

  it('Test success load, many data without redirection', async () => {
    counter = {
      warning: 0,
      error: 0,
      push: 0,
    };
    mock.onGet('/octo-spy/api/deployment')
      .reply(200, {
        total: 2,
        page: 0,
        count: 10,
        resources: [{ alive: true }, { alive: false }],
      });

    await wrapper.vm.search(
      wrapper.vm.filters,
      wrapper.vm.sort,
      wrapper.vm.pagination,
      false,
    );
    expect(counter).toEqual({ warning: 0, error: 0, push: 0 });
  });

  it('Test success load without sorting', async () => {
    counter = {
      warning: 0,
      error: 0,
      push: 0,
    };
    mock.onGet('/octo-spy/api/deployment')
      .reply(200, {
        total: 2,
        page: 0,
        count: 10,
        resources: [{ alive: true }, { alive: false }],
      });

    await wrapper.vm.search(
      wrapper.vm.filters,
      { type: '' },
      wrapper.vm.pagination,
    );
    expect(counter).toEqual({ warning: 0, error: 0, push: 0 });
  });

  it('Test error load', async () => {
    counter = {
      warning: 0,
      error: 0,
      push: 0,
    };
    mock.onGet('/octo-spy/api/deployment')
      .reply(400, { message: 'test' });

    await wrapper.vm.search(
      wrapper.vm.filters,
      wrapper.vm.sort,
      wrapper.vm.pagination,
      false,
    );
    wrapper.vm.errorOnLoading({ data: { message: 'test' } });
    expect(counter).toEqual({ warning: 0, error: 1, push: 0 });
  });
});
