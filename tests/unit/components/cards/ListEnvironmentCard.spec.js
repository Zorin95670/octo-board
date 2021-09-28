import { createLocalVue, shallowMount } from '@vue/test-utils';
import component from '@/components/cards/environment/ListEnvironmentCard.vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vuetify from 'vuetify';

const mock = new MockAdapter(axios);
const localVue = createLocalVue();

localVue.use(VueAxios, axios);

describe('ListEnvironmentCard', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(component, {
      localVue,
      vuetify,
      propsData: {
        defaultEnvironments: [{ id: 1, name: 'test' }],
      },
      mocks: {
        $refs: {
          environmentForm: {
            reset: null,
          },
        },
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

  it('Test watch: defaultEnvironments', async () => {
    wrapper.setProps({ defaultEnvironments: [] });
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.defaultEnvironments).toEqual([]);
      expect(wrapper.vm.environments).toEqual([]);
    });
    wrapper.setProps({ defaultEnvironments: [{ id: 1, name: 'test' }] });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.defaultEnvironments).toEqual([{ id: 1, name: 'test' }]);
      expect(wrapper.vm.environments).toEqual([{ id: 1, name: 'test' }]);
    });
  });

  it('Test method: openChangesDialog', () => {
    wrapper.vm.id = 1;
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.openChangesDialog();
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: openDeletedDialog', async () => {
    wrapper.setProps({ defaultEnvironments: [{ id: 1, name: 'test' }] });
    await wrapper.vm.$nextTick();
    wrapper.vm.id = 1;
    wrapper.vm.openDialog = jest.fn();
    wrapper.vm.openDeletedDialog(1);
    expect(wrapper.vm.openDialog).toBeCalled();
  });

  it('Test method: delete', async () => {
    mock.onDelete('/octo-spy/api/environments/1')
      .reply(204);

    wrapper.vm.$root.$emit = jest.fn();
    await wrapper.vm.delete(1);
    expect(wrapper.vm.$root.$emit).toBeCalled();
  });

  it('Test method: reset', async () => {
    wrapper.vm.environments.push(1);
    wrapper.vm.reset();
    expect(wrapper.vm.environments).toEqual([{ id: 1, name: 'test' }]);
  });

  it('Test method: update', async () => {
    wrapper.vm.changes.push(1);
    wrapper.vm.drag = { from: 0, to: 0 };
    wrapper.vm.update();
    expect(wrapper.vm.changes).toEqual([1]);

    wrapper.setProps({ defaultEnvironments: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }] });
    await wrapper.vm.$nextTick();
    wrapper.vm.drag = { from: 1, to: 0 };
    wrapper.vm.update();
    expect(wrapper.vm.changes).toEqual([2, 1]);
  });

  it('Test method: save', async () => {
    wrapper.setProps({ defaultEnvironments: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }] });
    await wrapper.vm.$nextTick();
    wrapper.vm.$root.$emit = jest.fn();
    await wrapper.vm.save();
    expect(wrapper.vm.$root.$emit).toBeCalled();
  });

  it('Test method: dragStart', () => {
    const event = { dataTransfer: { setDragImage: jest.fn() } };
    wrapper.vm.dragStart(event, 2);
    expect(event.dataTransfer.setDragImage).toBeCalled();
    expect(wrapper.vm.drag.from).toEqual(2);
  });
});
