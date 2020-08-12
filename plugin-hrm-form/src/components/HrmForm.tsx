import React from 'react';
import PropTypes from 'prop-types';
import { withTaskContext, ITask } from '@twilio/flex-ui';
import { connect } from 'react-redux';

import CallTypeButtons from './callTypeButtons';
import TabbedForms from './tabbedForms';
import Case from './case';
import { formType } from '../types';
import { namespace, routingBase } from '../states';
import * as RoutingActions from '../states/routing/actions';
import { RoutingState } from '../states/routing/reducer';

type OwnProps = {
  task: ITask;
  form: any;
  handleBlur: any;
  handleCategoryToggle: any;
  handleChange: any;
  handleCallTypeButtonClick: any;
  handleCompleteTask: any;
  handleFocus: any;
  handleSelectSearchResult: any;
  changeTab: any;
  handleValidateForm: any;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const HrmForm: React.FC<Props> = props => {
  // eslint-disable-next-line react/prop-types
  if (!props.routing) return null;
  // eslint-disable-next-line react/prop-types
  const { route } = props.routing;

  switch (route) {
    case 'tabbed-forms':
      return (
        <TabbedForms
          form={props.form}
          handleBlur={props.handleBlur}
          handleCategoryToggle={props.handleCategoryToggle}
          handleChange={props.handleChange}
          handleCallTypeButtonClick={props.handleCallTypeButtonClick}
          handleFocus={props.handleFocus}
          handleSelectSearchResult={props.handleSelectSearchResult}
          changeTab={props.changeTab}
          changeRoute={props.changeRoute}
          handleCompleteTask={props.handleCompleteTask}
          handleValidateForm={props.handleValidateForm}
        />
      );

    case 'new-case':
      return <Case handleCompleteTask={props.handleCompleteTask} />;

    case 'select-call-type':
    default:
      return (
        <CallTypeButtons
          form={props.form}
          handleCallTypeButtonClick={props.handleCallTypeButtonClick}
          changeTab={props.changeTab}
          handleCompleteTask={props.handleCompleteTask}
          changeRoute={props.changeRoute}
        />
      );
  }
};

HrmForm.displayName = 'HrmForm';
HrmForm.propTypes = {
  form: formType.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleCategoryToggle: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCallTypeButtonClick: PropTypes.func.isRequired,
  handleCompleteTask: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleSelectSearchResult: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
  changeRoute: PropTypes.func.isRequired,
  handleValidateForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps: OwnProps) => {
  const routingState: RoutingState = state[namespace][routingBase];

  return { routing: routingState.tasks[ownProps.task.taskSid] };
};

const mapDispatchToProps = {
  changeRoute: RoutingActions.changeRoute,
};

// @ts-ignore
export default withTaskContext(connect(mapStateToProps, mapDispatchToProps)(HrmForm));