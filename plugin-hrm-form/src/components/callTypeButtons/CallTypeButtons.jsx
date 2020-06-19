import React from 'react';
import PropTypes from 'prop-types';
import { withTaskContext, Template } from '@twilio/flex-ui';
import FaceIcon from '@material-ui/icons/Face';

import { withLocalization } from '../../contexts/LocalizationContext';
import { Box } from '../../styles/HrmStyles';
import { Container, Label, DataCallTypeButton, NonDataCallTypeButton } from '../../styles/callTypeButtons';
import callTypes from '../../states/DomainConstants';
import { isNonDataCallType } from '../../states/ValidationRules';
import { formType, taskType, localizationType } from '../../types';
import NonDataCallTypeDialog from './NonDataCallTypeDialog';
import { hasTaskControl } from '../../utils/transfer';

const isDialogOpen = form =>
  Boolean(form && form.callType && form.callType.value && isNonDataCallType(form.callType.value));

const clearCallType = props => props.handleCallTypeButtonClick(props.task.taskSid, '');

const CallTypeButtons = props => {
  const { form, task, localization } = props;
  const { isCallTask } = localization;

  const handleChildTypeClick = () => {
    if (hasTaskControl(task)) props.handleCallTypeButtonClick(task.taskSid, callTypes.child);
  };

  const handleCallerTypeClick = () => {
    if (hasTaskControl(task)) props.handleCallTypeButtonClick(task.taskSid, callTypes.caller);
  };

  const handleNonDataTypeClick = callType => {
    if (hasTaskControl(task)) props.handleCallTypeButtonClick(task.taskSid, callTypes[callType]);
  };

  return (
    <>
      <Container>
        <Box marginBottom="29px">
          <Label>categorize this contact</Label>
          <DataCallTypeButton onClick={handleChildTypeClick}>
            <Box width="50px" marginRight="5px">
              <FaceIcon />
            </Box>
            <Template code="CallType-child" />
          </DataCallTypeButton>
          <DataCallTypeButton onClick={handleCallerTypeClick}>
            <Box width="50px" marginRight="5px">
              <FaceIcon style={{ marginRight: '-5px' }} />
              <FaceIcon />
            </Box>
            <Template code="CallType-caller" />
          </DataCallTypeButton>
        </Box>

        <Box>
          <Label>Or was this contact…</Label>
          {Object.keys(callTypes)
            .filter(callType => isNonDataCallType(callTypes[callType]))
            .map((callType, i) => (
              <NonDataCallTypeButton
                key={callType}
                onClick={() => handleNonDataTypeClick(callType)}
                marginRight={i % 2 === 0}
              >
                <Template code={`CallType-${callType}`} />
              </NonDataCallTypeButton>
            ))}
        </Box>
      </Container>
      <NonDataCallTypeDialog
        isOpen={isDialogOpen(form)}
        isCallTask={isCallTask(task)}
        handleConfirm={() => props.handleSubmit(task)}
        handleCancel={() => clearCallType(props)}
      />
    </>
  );
};

CallTypeButtons.displayName = 'CallTypeButtons';
CallTypeButtons.propTypes = {
  form: formType.isRequired,
  task: taskType.isRequired,
  handleCallTypeButtonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  localization: localizationType.isRequired,
};

export default withLocalization(withTaskContext(CallTypeButtons));
