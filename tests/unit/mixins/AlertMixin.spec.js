import { createLocalVue, shallowMount } from '@vue/test-utils';
import mixin from '@/mixins/AlertMixin';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('Test AlertMixin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount({
      render: jest.fn(),
      mixins: [mixin],
    }, {
      localVue,
      mocks: {
        $store: {
          commit: jest.fn(),
          state: {
            user: {
              token: null,
            },
          },
        },
      },
    });
  });

  it('Test computed: token', () => {
    expect(wrapper.vm.token)
      .toBeNull();
  });

  it('Test method: loadAlerts', async () => {
    mock.onGet('/octo-spy/api/alerts')
      .reply(204);

    await wrapper.vm.loadAlerts();
    expect(wrapper.vm.$store.commit).toBeCalledTimes(1);
    mock.onGet('/octo-spy/api/alerts')
      .reply(200, {
        resources: [],
      });

    await wrapper.vm.loadAlerts();
    expect(wrapper.vm.$store.commit).toBeCalledTimes(2);
  });
});
