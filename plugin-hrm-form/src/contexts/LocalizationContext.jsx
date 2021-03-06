import React from 'react';

/**
 * @type {{ manager: any; isCallTask: (task: import('@twilio/flex-ui').ITask) => boolean }}
 */
const initialState = {
  manager: { strings: null },
  isCallTask: () => null,
};

const LocalizationContext = React.createContext(initialState);
LocalizationContext.displayName = 'LocalizationContext';

export const withLocalization = Component => {
  const LocalizedComponent = props => (
    <LocalizationContext.Consumer>
      {context => <Component {...props} localization={context} />}
    </LocalizationContext.Consumer>
  );
  LocalizedComponent.displayName = 'LocalizedComponent';
  return LocalizedComponent;
};

export default LocalizationContext;
