import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';
import { StorelessThemeProvider } from '@twilio/flex-ui';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import '../../mockGetConfig';
import HrmTheme from '../../../styles/HrmTheme';
import AddNote from '../../../components/case/AddNote';
import { configurationBase, connectedCaseBase, contactFormsBase, namespace } from '../../../states';
import * as RoutingActions from '../../../states/routing/actions';
import * as CaseActions from '../../../states/case/actions';
import { updateCase } from '../../../services/CaseService';

jest.mock('../../../services/CaseService');

const flushPromises = () => new Promise(setImmediate);

expect.extend(toHaveNoViolations);

const mockStore = configureMockStore([]);

const state = {
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
          temporaryCaseInfo: 'Mocked temp value',
          connectedCase: {
            createdAt: 1593469560208,
            twilioWorkerId: 'worker1',
            status: 'open',
            info: null,
          },
        },
      },
    },
  },
};

const store = mockStore(state);
store.dispatch = jest.fn();

const themeConf = {
  colorTheme: HrmTheme,
};

test('Test close functionality', async () => {
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    onClickClose,
    task: {
      taskSid: 'task1',
    },
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <Provider store={store}>
        <AddNote {...ownProps} />
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

test('Test input/add note functionality', async () => {
  const note = 'Some note';
  const updatedCase = {
    info: { notes: [note] },
  };
  updateCase.mockReturnValueOnce(Promise.resolve(updatedCase));
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    onClickClose,
    task: {
      taskSid: 'task1',
    },
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <Provider store={store}>
        <AddNote {...ownProps} />
      </Provider>
    </StorelessThemeProvider>,
  );

  expect(store.dispatch).not.toHaveBeenCalled();

  const textarea = screen.getByTestId('Case-AddNoteScreen-TextArea');
  fireEvent.change(textarea, { target: { value: note } });

  expect(store.dispatch).toHaveBeenCalledWith(CaseActions.updateTempInfo(note, ownProps.task.taskSid));

  store.dispatch.mockClear();
  expect(store.dispatch).not.toHaveBeenCalled();

  screen.getByTestId('Case-AddNoteScreen-SaveNote').click();
  await flushPromises();

  expect(store.dispatch).toHaveBeenCalledTimes(3);
  expect(updateCase).toHaveBeenCalled();
  const setConnectedCaseCall = store.dispatch.mock.calls[0][0];
  expect(setConnectedCaseCall.type).toBe('SET_CONNECTED_CASE');
  expect(setConnectedCaseCall.taskId).toBe(ownProps.task.taskSid);
  expect(setConnectedCaseCall.connectedCase).toBe(updatedCase);

  expect(store.dispatch).toHaveBeenCalledWith(RoutingActions.changeRoute({ route: 'new-case' }, ownProps.task.taskSid));
  store.dispatch.mockClear();
});

test('a11y', async () => {
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    onClickClose,
    task: {
      taskSid: 'task1',
    },
  };

  const wrapper = mount(
    <StorelessThemeProvider themeConf={themeConf}>
      <Provider store={store}>
        <AddNote {...ownProps} />
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