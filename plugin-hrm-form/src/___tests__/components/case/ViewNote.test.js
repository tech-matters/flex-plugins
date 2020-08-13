import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { StorelessThemeProvider } from '@twilio/flex-ui';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';

import { UnconnectedViewNote } from '../../../components/case/ViewNote';
import HrmTheme from '../../../styles/HrmTheme';

expect.extend(toHaveNoViolations);

const themeConf = {
  colorTheme: HrmTheme,
};

test('displays counselor, date and note', () => {
  const counselor = 'John Doe';
  const date = '8/12/2020';
  const note = 'lorem ipsum';

  const counselorsHash = {
    'counselor-hash-1': counselor,
  };

  const connectedCaseState = {
    viewNoteInfo: {
      counselor: 'counselor-hash-1',
      date,
      note,
    },
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <UnconnectedViewNote
        taskSid="taskSid"
        connectedCaseState={connectedCaseState}
        changeRoute={jest.fn()}
        counselorsHash={counselorsHash}
      />
    </StorelessThemeProvider>,
  );

  expect(screen.getByTestId('Case-ViewNoteScreen-Counselor')).toHaveTextContent(counselor);
  expect(screen.getByTestId('Case-ViewNoteScreen-Date')).toHaveTextContent(date);
  expect(screen.getByTestId('Case-ViewNoteScreen-Note')).toHaveTextContent(note);
});

test('click on x button', () => {
  const changeRoute = jest.fn();
  const taskSid = 'task-id';
  const counselor = 'John Doe';
  const date = '8/12/2020';
  const note = 'lorem ipsum';

  const counselorsHash = {
    'counselor-hash-1': counselor,
  };

  const connectedCaseState = {
    viewNoteInfo: {
      counselor: 'counselor-hash-1',
      date,
      note,
    },
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <UnconnectedViewNote
        taskSid={taskSid}
        connectedCaseState={connectedCaseState}
        changeRoute={changeRoute}
        counselorsHash={counselorsHash}
      />
    </StorelessThemeProvider>,
  );

  expect(screen.getByTestId('Case-ViewNoteScreen-CloseCross')).toBeInTheDocument();
  screen.getByTestId('Case-ViewNoteScreen-CloseCross').click();

  expect(changeRoute).toHaveBeenCalledWith({ route: 'new-case' }, taskSid);
});

test('click on close button', () => {
  const changeRoute = jest.fn();
  const taskSid = 'task-id';
  const counselor = 'John Doe';
  const date = '8/12/2020';
  const note = 'lorem ipsum';

  const counselorsHash = {
    'counselor-hash-1': counselor,
  };

  const connectedCaseState = {
    viewNoteInfo: {
      counselor: 'counselor-hash-1',
      date,
      note,
    },
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <UnconnectedViewNote
        taskSid={taskSid}
        connectedCaseState={connectedCaseState}
        changeRoute={changeRoute}
        counselorsHash={counselorsHash}
      />
    </StorelessThemeProvider>,
  );

  expect(screen.getByTestId('Case-ViewNoteScreen-CloseButton')).toBeInTheDocument();
  screen.getByTestId('Case-ViewNoteScreen-CloseButton').click();

  expect(changeRoute).toHaveBeenCalledWith({ route: 'new-case' }, taskSid);
});

test('a11y', async () => {
  const counselor = 'John Doe';
  const date = '8/12/2020';
  const note = 'lorem ipsum';

  const counselorsHash = {
    'counselor-hash-1': counselor,
  };

  const connectedCaseState = {
    viewNoteInfo: {
      counselor: 'counselor-hash-1',
      date,
      note,
    },
  };

  const wrapper = mount(
    <StorelessThemeProvider themeConf={themeConf}>
      <UnconnectedViewNote
        taskSid="taskSid"
        connectedCaseState={connectedCaseState}
        changeRoute={jest.fn()}
        counselorsHash={counselorsHash}
      />
    </StorelessThemeProvider>,
  );

  const rules = {
    region: { enabled: false },
  };

  const axe = configureAxe({ rules });
  const results = await axe(wrapper.getDOMNode());

  expect(results).toHaveNoViolations();
});
