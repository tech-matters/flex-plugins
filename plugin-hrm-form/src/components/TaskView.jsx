import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withTaskContext } from '@twilio/flex-ui';

import HrmForm from './HrmForm';
import { formType, taskType } from '../types';
import { namespace, contactFormsBase } from '../states';
import { Actions } from '../states/ContactState';
import { handleBlur, handleCategoryToggle, handleFocus, handleSubmit } from '../states/ActionCreators';
import { handleSelectSearchResult } from '../states/SearchContact';

const wrapperStyle = {
  position: 'absolute',
  margin: '0',
  padding: '0',
  border: '0px',

  // overflow: "hidden",  // this prevents scrolling
  height: '100%',
  width: '100%',
};

class TaskView extends Component {
  static displayName = 'TaskView';

  static propTypes = {
    task: taskType.isRequired,
    thisTask: taskType.isRequired,
    form: formType.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleCallTypeButtonClick: PropTypes.func.isRequired,
    handleCompleteTask: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleFocus: PropTypes.func.isRequired,
    handleSelectSearchResult: PropTypes.func.isRequired,
  };

  componentDidMount() {
    console.log('IFrame mounted');
  }

  componentWillUnmount() {
    console.log('IFrame unmounted');
  }

  render() {
    const { task, thisTask, form } = this.props;

    if (!task) {
      return null;
    }

    // If this task is not the active task, hide it
    const show = task && task.taskSid === thisTask.taskSid ? 'visible' : 'hidden';

    return (
      <div style={{ ...wrapperStyle, visibility: show }}>
        <HrmForm
          form={form}
          handleBlur={this.props.handleBlur(form, task.taskSid)}
          handleCategoryToggle={handleCategoryToggle(form, this.props.handleChange)}
          handleChange={this.props.handleChange}
          handleCallTypeButtonClick={this.props.handleCallTypeButtonClick}
          handleSubmit={this.props.handleSubmit(form, this.props.handleCompleteTask)}
          handleFocus={this.props.handleFocus}
          handleSelectSearchResult={this.props.handleSelectSearchResult}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // This should already have been created when beforeAcceptTask is fired
  return {
    form: state[namespace][contactFormsBase].tasks[ownProps.thisTask.taskSid],
  };
};

const mapDispatchToProps = dispatch => ({
  handleBlur: handleBlur(dispatch),
  handleCallTypeButtonClick: bindActionCreators(Actions.handleCallTypeButtonClick, dispatch),
  handleChange: bindActionCreators(Actions.handleChange, dispatch),
  handleFocus: handleFocus(dispatch),
  handleSubmit: handleSubmit(dispatch),
  handleSelectSearchResult: bindActionCreators(handleSelectSearchResult, dispatch),
});

export default withTaskContext(connect(mapStateToProps, mapDispatchToProps)(TaskView));