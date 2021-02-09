import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTaskContext, TaskHelper } from '@twilio/flex-ui';

import HrmForm from './HrmForm';
import FormNotEditable from './FormNotEditable';
import { taskType } from '../types';
import { namespace, contactFormsBase, searchContactsBase, routingBase } from '../states';
import * as GeneralActions from '../states/actions';
import { hasTaskControl } from '../utils/transfer';
import {
  CallerInformationTab as callerFormDefinition,
  ChildInformationTab as childFormDefinition,
  CaseInformationTab as caseInfoFormDefinition,
  IssueCategorizationTab as categoriesFormDefinition,
} from '../formDefinitions/ZA';

// The tabbed form definitions, used to create new form state.
const definitions = {
  callerFormDefinition,
  caseInfoFormDefinition,
  categoriesFormDefinition,
  childFormDefinition,
};

class TaskView extends Component {
  static displayName = 'TaskView';

  static propTypes = {
    task: taskType,
    thisTask: taskType.isRequired,
    contactFormStateExists: PropTypes.bool.isRequired,
    routingStateExists: PropTypes.bool.isRequired,
    searchStateExists: PropTypes.bool.isRequired,
    handleCompleteTask: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    task: null,
  };

  // eslint-disable-next-line complexity
  componentDidMount() {
    const { contactFormStateExists, routingStateExists, searchStateExists } = this.props;
    if (!contactFormStateExists || !routingStateExists || !searchStateExists) {
      this.props.dispatch(GeneralActions.recreateContactState(definitions)(this.props.thisTask.taskSid));
    }
  }

  render() {
    const { task, thisTask } = this.props;

    // If this task is not the active task, or if the task is not accepted yet, hide it
    const show = task && task.taskSid === thisTask.taskSid && !TaskHelper.isPending(task);

    if (!show) {
      return null;
    }

    return (
      <div style={{ height: '100%' }}>
        {!hasTaskControl(thisTask) && <FormNotEditable />}
        <HrmForm handleCompleteTask={this.props.handleCompleteTask} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // Check if the entry for this task exists in each reducer
  const contactFormStateExists = Boolean(state[namespace][contactFormsBase].tasks[ownProps.thisTask.taskSid]);
  const routingStateExists = Boolean(state[namespace][routingBase].tasks[ownProps.thisTask.taskSid]);
  const searchStateExists = Boolean(state[namespace][searchContactsBase].tasks[ownProps.thisTask.taskSid]);

  // This should already have been created when beforeAcceptTask is fired
  return {
    contactFormStateExists,
    routingStateExists,
    searchStateExists,
  };
};

export default withTaskContext(connect(mapStateToProps, null)(TaskView));
