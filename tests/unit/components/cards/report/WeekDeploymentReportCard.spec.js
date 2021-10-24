import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueAxios from 'vue-axios';
import VueChart from 'vue-chart-js';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';
import component from '@/components/cards/report/WeekDeploymentReportCard.vue';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);
localVue.use(VueChart);

describe('WeekDeploymentReportCard', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        globalLoading: false,
        masterProjects: [],
        environments: [],
        clients: [],
      },
    });
  });

  it('Test method: setMasterProjectsParameters', () => {
    const params = new URLSearchParams();
    wrapper.vm.setMasterProjectsParameters(params, []);
    expect(params.has('masterProject')).toBeFalsy();

    wrapper.vm.setMasterProjectsParameters(params, ['a', 'b']);
    expect(params.has('masterProject')).toBeTruthy();
    expect(params.get('masterProject')).toEqual('a|b');
  });

  it('Test method: setEnvironmentsParameters', () => {
    const params = new URLSearchParams();
    wrapper.vm.setEnvironmentsParameters(params, []);
    expect(params.has('environment')).toBeFalsy();

    wrapper.vm.setEnvironmentsParameters(params, ['a', 'b']);
    expect(params.has('environment')).toBeTruthy();
    expect(params.get('environment')).toEqual('a|b');
  });

  it('Test method: setClientsParameters', () => {
    const params = new URLSearchParams();
    wrapper.vm.setClientsParameters(params, []);
    expect(params.has('client')).toBeFalsy();

    wrapper.vm.setClientsParameters(params, ['a', 'b']);
    expect(params.has('client')).toBeTruthy();
    expect(params.get('client')).toEqual('a|b');
  });

  it('Test method: reload', async () => {
    mock.onGet('/octo-spy/api/reports/deployments')
      .reply(200, []);
    await wrapper.vm.reload([], [], []);
    expect(wrapper.vm.chartData.datasets).toEqual([]);
    wrapper.setProps({
      masterProjects: [{
        id: 1,
        name: 'test',
        color: 'red',
      }],
    });
    mock.onGet('/octo-spy/api/reports/deployments')
      .reply(200, [{
        masterProject: '1',
        dayOfWeek: '2',
        hour: '3',
        count: '4',
      }]);
    await wrapper.vm.reload([], [], []);
    expect(wrapper.vm.chartData.datasets).toEqual([{
      backgroundColor: 'rgba(red,0.5)',
      borderColor: 'rgb(red)',
      borderWidth: 3,
      data: [{
        count: 4,
        r: 15,
        x: 2,
        y: 3,
      }],
      fill: false,
      label: 'test',
    }]);

    wrapper.setProps({
      masterProjects: [{
        id: 1,
        name: 'test',
      }],
    });
    mock.onGet('/octo-spy/api/reports/deployments')
      .reply(200, [{
        masterProject: '1',
        dayOfWeek: '2',
        hour: '3',
        count: '4',
      }]);
    await wrapper.vm.reload([], [], []);
    expect(wrapper.vm.chartData.datasets).toEqual([{
      backgroundColor: 'rgba(63,81,181,0.5)',
      borderColor: 'rgb(63,81,181)',
      borderWidth: 3,
      data: [{
        count: 4,
        r: 15,
        x: 2,
        y: 3,
      }],
      fill: false,
      label: 'test',
    }]);
  });

  it('Test method: getTooltipLabel', () => {
    expect(wrapper.vm.getTooltipLabel({
      datasetIndex: 0,
      index: 0,
    }, {
      datasets: [{
        data: [{
          count: 1,
          y: 8,
          x: 0,
        }],
      }],
    })).toEqual('1 deployments at 8H00 on Sunday.');
  });

  it('Test method: getHourFormat', () => {
    expect(wrapper.vm.getHourFormat(8)).toEqual('8H00');
  });

  it('Test method: getDayName', () => {
    expect(wrapper.vm.getDayName(0)).toEqual('Sunday');
  });

  it('Test method: r', () => {
    expect(wrapper.vm.r(0, 10)).toEqual(15);
    expect(wrapper.vm.r(100, 10)).toEqual(6);
    expect(wrapper.vm.r(10, 10)).toEqual(20);
  });
});
