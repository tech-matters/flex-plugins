import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withTaskContext, Template } from '@twilio/flex-ui';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/Folder';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { Menu, MenuItem } from '../menu';
import { formIsValid } from '../../states/ValidationRules';
import { formType, taskType } from '../../types';
import { Box, BottomButtonBar, StyledNextStepButton } from '../../styles/HrmStyles';
import * as CaseActions from '../../states/case/actions';
import * as RoutingActions from '../../states/routing/actions';
import { getConfig } from '../../HrmFormPlugin';
import { createCase } from '../../services/CaseService';
import { saveToHrm } from '../../services/ContactService';
import { hasTaskControl } from '../../utils/transfer';

class BottomBar extends Component {
  static displayName = 'BottomBar';

  static propTypes = {
    tabs: PropTypes.number.isRequired,
    form: formType.isRequired,
    changeTab: PropTypes.func.isRequired,
    handleCompleteTask: PropTypes.func.isRequired,
    task: taskType.isRequired,
    changeRoute: PropTypes.func.isRequired,
    handleValidateForm: PropTypes.func.isRequired,
    setConnectedCase: PropTypes.func.isRequired,
    handleSubmitIfValid: PropTypes.func.isRequired,
    optionalButtons: PropTypes.arrayOf(PropTypes.shape({ onClick: PropTypes.func, label: PropTypes.string })),
  };

  static defaultProps = {
    optionalButtons: undefined,
  };

  state = {
    anchorEl: null,
    isMenuOpen: false,
    mockedMessage: null,
  };

  toggleCaseMenu = e => {
    e.persist();
    this.setState(prevState => ({ anchorEl: e.currentTarget || e.target, isMenuOpen: !prevState.isMenuOpen }));
  };

  handleMockedMessage = () => this.setState({ mockedMessage: <Template code="NotImplemented" />, isMenuOpen: false });

  closeMockedMessage = () => this.setState({ mockedMessage: null });

  handleOpenNewCase = async () => {
    const { task } = this.props;
    const { taskSid } = task;
    const { workerSid, helpline, strings } = getConfig();

    if (!hasTaskControl(task)) return;

    const caseRecord = {
      helpline,
      status: 'open',
      twilioWorkerId: workerSid,
    };

    this.setState({ isMenuOpen: false });

    const newForm = this.props.handleValidateForm();

    if (formIsValid(newForm)) {
      try {
        const caseFromDB = await createCase(caseRecord);
        this.props.changeRoute({ route: 'new-case' }, taskSid);
        this.props.setConnectedCase(caseFromDB, taskSid);
      } catch (error) {
        window.alert(strings['Error-Backend']);
      }
    } else {
      window.alert(strings['Error-Form']);
    }
  };

  handleNext = () => {
    const { task, form } = this.props;
    const { tab } = form.metadata;
    this.props.changeTab(tab + 1, task.taskSid);
  };

  handleSubmit = async () => {
    const { hrmBaseUrl, workerSid, helpline, strings } = getConfig();
    const { task } = this.props;

    if (!hasTaskControl(task)) return;

    const newForm = this.props.handleValidateForm();

    if (formIsValid(newForm)) {
      try {
        await saveToHrm(task, newForm, hrmBaseUrl, workerSid, helpline);
        this.props.handleCompleteTask(task.taskSid, task);
      } catch (error) {
        if (window.confirm(strings['Error-ContinueWithoutRecording'])) {
          this.props.handleCompleteTask(task.taskSid, task);
        }
      }
    } else {
      window.alert(strings['Error-Form']);
    }
  };

  onError = () => {
    const { strings } = getConfig();
    window.alert(strings['Error-Form']);
  };

  render() {
    const { tabs, form, handleSubmitIfValid, optionalButtons } = this.props;
    const { isMenuOpen, anchorEl, mockedMessage } = this.state;

    const { tab } = form.metadata;
    const showNextButton = tab !== 0 && tab < tabs - 1;
    const showSubmitButton = tab === tabs - 1;
    const showBottomBar = showNextButton || showSubmitButton;
    const isSubmitButtonDisabled = !formIsValid(form);
    const isMockedMessageOpen = Boolean(mockedMessage);
    const { featureFlags } = getConfig();

    if (!showBottomBar) return null;

    return (
      <>
        <Dialog onClose={this.closeMockedMessage} open={isMockedMessageOpen}>
          <DialogContent>{mockedMessage}</DialogContent>
        </Dialog>
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClickAway={() => this.setState({ isMenuOpen: false })}>
          <MenuItem
            Icon={FolderOpenIcon}
            text={<Template code="BottomBar-OpenNewCase" />}
            onClick={handleSubmitIfValid(this.handleOpenNewCase, this.onError)}
          />
          <MenuItem
            Icon={AddIcon}
            text={<Template code="BottomBar-AddToExistingCase" />}
            onClick={this.handleMockedMessage}
          />
        </Menu>
        <BottomButtonBar>
          {optionalButtons &&
            optionalButtons.map((i, index) => (
              <Box key={`optional-button-${index}`} marginRight="15px">
                <StyledNextStepButton type="button" roundCorners secondary onClick={i.onClick}>
                  <Template code={i.label} />
                </StyledNextStepButton>
              </Box>
            ))}
          {showNextButton && (
            <StyledNextStepButton type="button" roundCorners={true} onClick={this.handleNext}>
              <Template code="BottomBar-Next" />
            </StyledNextStepButton>
          )}
          {showSubmitButton && (
            <>
              {featureFlags.enable_case_management && (
                <Box marginRight="15px">
                  <StyledNextStepButton
                    type="button"
                    roundCorners
                    secondary
                    onClick={this.toggleCaseMenu}
                    disabled={isSubmitButtonDisabled}
                  >
                    <FolderIcon style={{ fontSize: '16px', marginRight: '10px' }} />
                    <Template code="BottomBar-SaveAndAddToCase" />
                  </StyledNextStepButton>
                </Box>
              )}
              <StyledNextStepButton
                roundCorners={true}
                onClick={handleSubmitIfValid(this.handleSubmit, this.onError)}
                disabled={isSubmitButtonDisabled}
              >
                <Template code="BottomBar-SaveContact" />
              </StyledNextStepButton>
            </>
          )}
        </BottomButtonBar>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeRoute: bindActionCreators(RoutingActions.changeRoute, dispatch),
  setConnectedCase: bindActionCreators(CaseActions.setConnectedCase, dispatch),
});

export default withTaskContext(connect(null, mapDispatchToProps)(BottomBar));
