import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';
import { StorelessThemeProvider } from '@twilio/flex-ui';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import '../../mockGetConfig';
import { configurationBase, connectedCaseBase, contactFormsBase, namespace } from '../../../states';
import AddHousehold from '../../../components/case/AddHousehold';
import HrmTheme from '../../../styles/HrmTheme';
import { updateCase } from '../../../services/CaseService';

jest.mock('../../../services/CaseService');

const flushPromises = () => new Promise(setImmediate);

expect.extend(toHaveNoViolations);

const mockStore = configureMockStore([]);

const state1 = {
  [namespace]: {
    [configurationBase]: {
      counselors: {
        list: [],
        hash: { worker1: 'worker1 name' },
      },
    },
    [contactFormsBase]: {
      tasks: {
        task1: {
          childInformation: {
            name: { firstName: { value: 'first' }, lastName: { value: 'last' } },
          },
          metadata: {},
        },
      },
    },
    [connectedCaseBase]: {
      tasks: {
        task1: {
          temporaryCaseInfo: { screen: 'add-household', info: {} },
          connectedCase: {
            createdAt: 1593469560208,
            twilioWorkerId: 'worker1',
            status: 'open',
            info: null,
          },
        },
      },
    },
    routing: {
      route: 'new-case',
      tasks: {
        task1: {
          route: 'new-case',
        },
      },
    },
  },
};
const store1 = mockStore(state1);
store1.dispatch = jest.fn();

const state2 = {
  ...state1,
  [namespace]: {
    ...state1[namespace],
    [connectedCaseBase]: {
      tasks: {
        task1: {
          temporaryCaseInfo: { screen: 'add-household', info: {} },
          connectedCase: {
            createdAt: 1593469560208,
            twilioWorkerId: 'worker1',
            status: 'open',
            info: null,
          },
        },
      },
    },
    routing: {
      route: 'new-case',
      tasks: {
        task1: {
          route: 'new-case',
        },
      },
    },
  },
};
const store2 = mockStore(state2);
store2.dispatch = jest.fn();

const state3 = {
  [namespace]: {
    ...state1[namespace],
    [connectedCaseBase]: {
      tasks: {
        task1: {
          temporaryCaseInfo: null,
          connectedCase: {
            createdAt: 1593469560208,
            twilioWorkerId: 'worker1',
            status: 'open',
            info: null,
          },
        },
      },
    },
    routing: {
      route: 'new-case',
      tasks: {
        task1: {
          route: 'new-case',
        },
      },
    },
  },
};
const store3 = mockStore(state3);
store3.dispatch = jest.fn();

const themeConf = {
  colorTheme: HrmTheme,
};

const task = {
  taskSid: 'task1',
};

describe('Test AddHousehold', () => {
  test('Test close functionality', async () => {
    const onClickClose = jest.fn();

    const ownProps = {
      counselor: 'Someone',
      onClickClose,
      task,
    };

    render(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store2}>
          <AddHousehold {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    expect(onClickClose).not.toHaveBeenCalled();

    expect(screen.getByTestId('Case-CloseCross')).toBeInTheDocument();
    screen.getByTestId('Case-CloseCross').click();

    expect(onClickClose).toHaveBeenCalled();

    onClickClose.mockClear();
    expect(onClickClose).not.toHaveBeenCalled();

    expect(screen.getByTestId('Case-CloseButton')).toBeInTheDocument();
    screen.getByTestId('Case-CloseButton').click();

    expect(onClickClose).toHaveBeenCalled();
  });

  test('Handle onSave and leave', async () => {
    const onClickClose = jest.fn();
    const household = { firstName: 'House', lastName: 'One' };

    const updatedCase = {
      info: { households: [household] },
      status: 'open',
    };

    updateCase.mockReturnValueOnce(Promise.resolve(updatedCase));

    const ownProps = {
      counselor: 'Someone',
      onClickClose,
      task,
    };

    render(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store2}>
          <AddHousehold {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    // Save and leave
    store2.dispatch.mockClear();
    screen.getByTestId('Case-AddHouseholdScreen-SaveHousehold').click();

    await flushPromises();

    expect(store2.dispatch).toHaveBeenCalled();
    expect(updateCase).toHaveBeenCalled();
    const setConnectedCaseCall1 = store2.dispatch.mock.calls[0][0];
    expect(setConnectedCaseCall1.type).toBe('SET_CONNECTED_CASE');
    expect(setConnectedCaseCall1.taskId).toBe(ownProps.task.taskSid);
    expect(setConnectedCaseCall1.connectedCase).toStrictEqual(updatedCase);

    expect(onClickClose).toHaveBeenCalled();
  });

  test('Handle onSave and stay', async () => {
    const onClickClose = jest.fn();
    const household = { firstName: 'House', lastName: 'One' };

    const updatedCase = {
      info: { households: [household] },
      status: 'open',
    };

    updateCase.mockReturnValueOnce(Promise.resolve(updatedCase));

    const ownProps = {
      counselor: 'Someone',
      onClickClose,
      task,
    };

    render(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store2}>
          <AddHousehold {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    // Save and stay
    store2.dispatch.mockClear();
    screen.getByTestId('Case-AddHouseholdScreen-SaveAndAddAnotherHousehold').click();

    await flushPromises();

    expect(store2.dispatch).toHaveBeenCalled();
    expect(updateCase).toHaveBeenCalled();
    const setConnectedCaseCall2 = store2.dispatch.mock.calls[0][0];
    expect(setConnectedCaseCall2.type).toBe('SET_CONNECTED_CASE');
    expect(setConnectedCaseCall2.taskId).toBe(ownProps.task.taskSid);
    expect(setConnectedCaseCall2.connectedCase).toStrictEqual(updatedCase);
  });

  test('a11y', async () => {
    const onClickClose = jest.fn();

    const ownProps = {
      counselor: 'Someone',
      onClickClose,
      task,
    };

    const wrapper = mount(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store2}>
          <AddHousehold {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    const rules = {
      region: { enabled: false },
    };

    const axe = configureAxe({ rules });
    const results = await axe(wrapper.getDOMNode());

    expect(results).toHaveNoViolations();
  });
});
