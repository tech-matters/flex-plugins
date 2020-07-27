import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';
import { StorelessThemeProvider } from '@twilio/flex-ui';

import HrmTheme from '../../../styles/HrmTheme';
import AddNote from '../../../components/case/AddNote';

expect.extend(toHaveNoViolations);

const themeConf = {
  colorTheme: HrmTheme,
};

test('Test close functionality', async () => {
  const handleSaveNote = jest.fn();
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    handleSaveNote,
    onClickClose,
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <AddNote {...ownProps} />
    </StorelessThemeProvider>,
  );

  expect(onClickClose).not.toHaveBeenCalled();

  expect(screen.getByTestId('Case-AddNoteScreen-CloseCross')).toBeInTheDocument();
  screen.getByTestId('Case-AddNoteScreen-CloseCross').click();

  expect(onClickClose).toHaveBeenCalled();

  onClickClose.mockClear();

  expect(onClickClose).not.toHaveBeenCalled();

  expect(screen.getByTestId('Case-AddNoteScreen-CloseButton')).toBeInTheDocument();
  screen.getByTestId('Case-AddNoteScreen-CloseButton').click();

  expect(onClickClose).toHaveBeenCalled();
});

test('Test input/add note functionality', async () => {
  const handleSaveNote = jest.fn();
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    handleSaveNote,
    onClickClose,
  };

  render(
    <StorelessThemeProvider themeConf={themeConf}>
      <AddNote {...ownProps} />
    </StorelessThemeProvider>,
  );

  expect(handleSaveNote).not.toHaveBeenCalled();

  const textarea = screen.getByTestId('Case-AddNoteScreen-TextArea');
  fireEvent.change(textarea, { target: { value: 'Some note' } });

  screen.getByTestId('Case-AddNoteScreen-SaveNote').click();

  expect(handleSaveNote).toHaveBeenCalledWith('Some note');
});

test('a11y', async () => {
  const handleSaveNote = jest.fn();
  const onClickClose = jest.fn();

  const ownProps = {
    counselor: 'Someone',
    handleSaveNote,
    onClickClose,
  };

  const wrapper = mount(
    <StorelessThemeProvider themeConf={themeConf}>
      <AddNote {...ownProps} />
    </StorelessThemeProvider>,
  );

  const rules = {
    region: { enabled: false },
  };

  const axe = configureAxe({ rules });
  const results = await axe(wrapper.getDOMNode());

  expect(results).toHaveNoViolations();
});
