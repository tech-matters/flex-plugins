import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { mount } from 'enzyme';
import { StorelessThemeProvider } from '@twilio/flex-ui';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import '../../mockGetConfig';
import { configurationBase, connectedCaseBase, contactFormsBase, namespace } from '../../../states';
import ViewPerpetrator from '../../../components/case/ViewPerpetrator';
import { CallerFormValues } from '../../../components/common/forms';
import HrmTheme from '../../../styles/HrmTheme';

expect.extend(toHaveNoViolations);
const mockStore = configureMockStore([]);

/** @type {CallerFormValues} */
const perpetrator = {
  name: {
    firstName: 'first',
    lastName: 'last',
  },
  location: {
    streetAddress: 'street',
    city: 'city',
    stateOrCounty: 'state',
    postalCode: 'code',
    phone1: 'phone1',
    phone2: 'phone2',
  },
  age: 'age',
  ethnicity: 'ethnicity',
  gender: 'gender',
  language: 'language',
  nationality: 'nationality',
  relationshipToChild: 'relationshipToChild',
};

const perpetratorEntry = { perpetrator, createdAt: '2020-06-29T22:26:00.208Z', twilioWorkerId: 'worker1' };

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
          temporaryCaseInfo: { screen: 'view-perpetrator', info: perpetratorEntry },
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

const task = {
  taskSid: 'task1',
};

describe('Test ViewPerpetrator', () => {
  test('Test close functionality', async () => {
    const onClickClose = jest.fn();

    const ownProps = {
      onClickClose,
      task,
    };

    render(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <ViewPerpetrator {...ownProps} />
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

  test('a11y', async () => {
    const onClickClose = jest.fn();

    const ownProps = {
      onClickClose,
      task,
    };

    const wrapper = mount(
      <StorelessThemeProvider themeConf={themeConf}>
        <Provider store={store}>
          <ViewPerpetrator {...ownProps} />
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
