import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';
import { StorelessThemeProvider, withTheme } from '@twilio/flex-ui';

import '../../mockGetConfig';
import HrmTheme from '../../../styles/HrmTheme';
import Case from '../../../components/case';
import CaseDetails from '../../../components/case/CaseDetails';
import { namespace, configurationBase, contactFormsBase } from '../../../states';
import { cancelCase, getActivities } from '../../../services/CaseService';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('../../../services/CaseService', () => ({ getActivities: jest.fn(), cancelCase: jest.fn() }));

/**
 * Fix issue with Popper.js:
 * https://stackoverflow.com/questions/60333156/how-to-fix-typeerror-document-createrange-is-not-a-function-error-while-testi
 */
global.document.createRange = () => ({
  setStart: () => null,
  setEnd: () => null,
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

expect.extend(toHaveNoViolations);
const mockStore = configureMockStore([]);

function createState(state) {
  return {
    [namespace]: state,
  };
}

const themeConf = {
  colorTheme: HrmTheme,
};

describe('useState mocked', () => {
  const setState = jest.fn();
  const useStateMock = initState => [initState, setState];

  jest.spyOn(React, 'useState').mockImplementation(useStateMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Case (should return null)', async () => {
    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const initialState = createState({
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
              name: { firstName: { value: 'first' }, lastName: { value: 'first' } },
            },
            metadata: {
              connectedCase: null,
            },
          },
        },
      },
    });
    const store = mockStore(initialState);

    const component = renderer.create(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    ).root;

    const details = component.findAllByType(CaseDetails);
    expect(details.length).toBe(0);
  });

  test('Case (should render)', async () => {
    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const state = {
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
            metadata: {
              connectedCase: {
                id: 123,
                createdAt: 1593469560208,
                twilioWorkerId: 'worker1',
                status: 'open',
              },
            },
            caseInformation: {
              callSummary: { value: 'contact call summary' },
            },
          },
        },
      },
    };
    const initialState = createState(state);
    const store = mockStore(initialState);

    const component = renderer.create(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    ).root;

    expect(component.findAllByType(CaseDetails).length).toBe(1);
    const details = component.findByType(CaseDetails);
    expect(details.props).toStrictEqual({
      name: 'first last',
      counselor: 'worker1 name',
      status: 'open',
      date: '6/29/2020', // the day the createdAt number represents
    });
  });

  function openCancelMenu(wrapper) {
    wrapper
      .find('button')
      .find('t')
      .findWhere(t => t.prop('code') === 'BottomBar-Cancel')
      .simulate('click');
  }

  function clickCancelCase(wrapper) {
    wrapper
      .find('MenuItem')
      .find('t')
      .findWhere(t => t.prop('code') === 'BottomBar-CancelNewCaseAndClose')
      .simulate('click');
  }

  test('click cancel button', () => {
    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const initialState = createState({
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
              name: { firstName: { value: 'first' }, lastName: { value: 'first' } },
            },
            metadata: {
              connectedCase: {
                id: 123,
                createdAt: '12345',
                twilioWorkerId: 'worker1',
                status: 'open',
              },
            },
            caseInformation: {
              callSummary: { value: 'contact call summary' },
            },
          },
        },
      },
    });
    const store = mockStore(initialState);

    const wrapper = mount(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    openCancelMenu(wrapper);
    clickCancelCase(wrapper);

    expect(cancelCase).toHaveBeenCalled();
  });

  test('click Add Note button', async () => {
    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const initialState = createState({
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
              name: { firstName: { value: 'first' }, lastName: { value: 'first' } },
            },
            metadata: {
              connectedCase: {
                id: 123,
                createdAt: '12345',
                twilioWorkerId: 'worker1',
                status: 'open',
              },
            },
            caseInformation: {
              callSummary: { value: 'contact call summary' },
            },
          },
        },
      },
    });
    const store = mockStore(initialState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    const CaseWrapper = wrapper.find('Case');

    CaseWrapper.find('CaseAddButton').simulate('click');
    expect(store.dispatch).toHaveBeenCalledWith({
      route: 'new-case',
      subroute: 'add-note',
      taskId: 'task1',
      type: 'CHANGE_ROUTE',
    });
  });
  test('edit case summary', async () => {
    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const initialState = createState({
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
              name: { firstName: { value: 'first' }, lastName: { value: 'first' } },
            },
            metadata: {
              connectedCase: {
                createdAt: '12345',
                twilioWorkerId: 'worker1',
                status: 'open',
              },
            },
            caseInformation: {
              callSummary: { value: 'contact call summary' },
            },
          },
        },
      },
    });
    const store = mockStore(initialState);
    store.dispatch = jest.fn();

    render(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
        </Provider>
      </StorelessThemeProvider>,
    );

    const textarea = screen.getByTestId('Case-CaseSummary-TextArea');
    fireEvent.change(textarea, { target: { value: 'Some summary' } });

    const updateCaseCall = store.dispatch.mock.calls[0][0];
    expect(updateCaseCall.type).toBe('UPDATE_CASE_INFO');
    expect(updateCaseCall.taskId).toBe(ownProps.task.taskSid);
    expect(updateCaseCall.info.summary).toBe('Some summary');
  });

  test('a11y', async () => {
    getActivities.mockReturnValueOnce(Promise.resolve([]));

    const ownProps = {
      task: {
        taskSid: 'task1',
      },
      handleCompleteTask: jest.fn(),
    };
    const initialState = createState({
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
              name: { firstName: { value: 'first' }, lastName: { value: 'first' } },
            },
            metadata: {
              connectedCase: {
                id: 123,
                createdAt: '12345',
                twilioWorkerId: 'worker1',
                status: 'open',
              },
            },
            caseInformation: {
              callSummary: { value: 'contact call summary' },
            },
          },
        },
      },
    });
    const store = mockStore(initialState);

    const wrapper = mount(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <Case {...ownProps} />
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
