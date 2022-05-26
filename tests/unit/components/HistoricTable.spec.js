import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';
import component from '@/components/HistoricTable.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  let vuetify;
  const router = new VueRouter();

  mock.onGet('/octo-spy/api/projects')
    .reply(200, { content: ['Project1', 'Project2'] });

  mock.onGet('/octo-spy/api/environments')
    .reply(200, { content: ['Environment1', 'Environment2'] });

  mock.onGet('/octo-spy/api/clients')
    .reply(200, { content: ['Client1', 'Client2'] });

  mock.onGet('/octo-spy/api/deployments')
    .reply(200, {
      resources: [{}],
      page: 1,
      total: 10,
      count: 1,
    });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      router,
      vuetify,
      mocks: {
        $store: {
          commit: jest.fn(),
          state: {
            user: {
              login: null,
              token: null,
              roles: [],
            },
          },
        },
      },
    });
  });

  it('Test computed: aliveText', () => {
    expect(wrapper.vm.aliveText).toEqual('Both');

    wrapper.vm.alive = 'true';
    expect(wrapper.vm.aliveText).toEqual('Yes');

    wrapper.vm.alive = 'false';
    expect(wrapper.vm.aliveText).toEqual('No');
  });

  it('Test method: createQueryParameters', () => {
    let params = wrapper.vm.createQueryParameters();
    expect(params).toEqual({ page: 0 });

    wrapper.vm.pagination.page = 3;
    params = wrapper.vm.createQueryParameters();
    expect(params).toEqual({ page: 2 });

    wrapper.vm.sort = 'alive';
    wrapper.vm.order = 'asc';
    params = wrapper.vm.createQueryParameters();
    expect(params).toEqual({
      page: 2,
      sort: 'alive',
      order: 'asc',
    });

    wrapper.vm.project = 'Project';
    wrapper.vm.client = 'test';
    params = wrapper.vm.createQueryParameters();
    expect(params).toEqual({
      page: 2,
      sort: 'alive',
      order: 'asc',
      project: 'Project',
      client: 'test',
    });
  });

  it('Test method: setPaginationAndSearch', () => {
    wrapper.vm.pagination.page = 3;
    wrapper.vm.search = jest.fn();

    wrapper.vm.setPaginationAndSearch();
    expect(wrapper.vm.pagination.page).toEqual(1);

    wrapper.vm.setPaginationAndSearch(2);
    expect(wrapper.vm.pagination.page).toEqual(2);
    expect(wrapper.vm.search).toBeCalledTimes(2);
  });

  it('Test method: tableUpdate', () => {
    wrapper.vm.setPaginationAndSearch = jest.fn();

    wrapper.vm.tableUpdate({ sortDesc: [], sortBy: [] });
    expect(wrapper.vm.sort).toBeNull();
    expect(wrapper.vm.order).toBeNull();
    wrapper.vm.tableUpdate({ sortDesc: [true], sortBy: ['test'] });
    expect(wrapper.vm.sort).toEqual('desc');
    expect(wrapper.vm.order).toEqual('test');
    wrapper.vm.tableUpdate({ sortDesc: [false], sortBy: ['test'] });
    expect(wrapper.vm.sort).toEqual('asc');
    expect(wrapper.vm.order).toEqual('test');
    expect(wrapper.vm.setPaginationAndSearch).toBeCalledTimes(3);
  });

  it('Test method: search', async () => {
    wrapper.vm.createQueryParameters = jest.fn(() => ({}));
    wrapper.vm.setUrlQueryParameters = jest.fn();

    await wrapper.vm.search();
    expect(wrapper.vm.loading).toBeFalsy();
    const cancel = jest.fn();
    wrapper.vm.cancel = cancel;

    await wrapper.vm.search();
    expect(wrapper.vm.loading).toBeFalsy();
    expect(wrapper.vm.createQueryParameters).toBeCalledTimes(2);
    expect(wrapper.vm.setUrlQueryParameters).toBeCalledTimes(2);
    expect(wrapper.vm.cancel).toBeNull();
    expect(cancel).toBeCalledTimes(1);
  });

  it('Test method: initHeaders', () => {
    expect(wrapper.vm.initHeaders(false).length).toEqual(6);
    expect(wrapper.vm.initHeaders(true).length).toEqual(7);
  });

  it('Test method: dialogDisableDeployment', () => {
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.dialogDisableDeployment(1);
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: disableDeployment', async () => {
    wrapper.vm.search = jest.fn();

    mock.onPatch('/octo-spy/api/deployments/1')
      .reply(204);

    await wrapper.vm.disableDeployment(1);
    expect(wrapper.vm.search).toBeCalled();
  });

  it('Test method: dialogDeleteDeployment', () => {
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.dialogDeleteDeployment(1);
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: deleteDeployment', async () => {
    wrapper.vm.search = jest.fn();

    mock.onDelete('/octo-spy/api/deployments/1')
      .reply(204);

    await wrapper.vm.deleteDeployment(1);
    expect(wrapper.vm.search).toBeCalled();
  });
});
