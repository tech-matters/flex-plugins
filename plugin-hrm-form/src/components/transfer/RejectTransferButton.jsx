import React from 'react';
import { TaskHelper } from '@twilio/flex-ui';
import PropTypes from 'prop-types';

import { StyledButton } from '../../styles/HrmStyles';
import { closeTransfer, rejectTransfer } from './helpers';

const handleRejectTransfer = async transferredTask => {
  const originalTask = TaskHelper.getTaskByTaskSid(transferredTask.attributes.transferMeta.originalReservation);
  console.log('ORIGINAL TASK1', transferredTask.attributes.transferMeta.originalReservation, originalTask)
  await closeTransfer(transferredTask);

  console.log('ORIGINAL TASK2', originalTask)
  await rejectTransfer(originalTask);
  console.log('TRANSFERRED TASK', transferredTask)
  await rejectTransfer(transferredTask)
};

const RejectTransferButton = ({ theme, task }) => {
  return (
    <StyledButton
      color={theme.colors.base11}
      background={theme.colors.base2}
      onClick={() => handleRejectTransfer(task)}
    >
      Reject Transfer
    </StyledButton>
  );
};

RejectTransferButton.displayName = 'RejectTransferButton';
RejectTransferButton.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      base2: PropTypes.string,
      base11: PropTypes.string,
    }),
  }).isRequired,
  task: PropTypes.shape({
    attributes: PropTypes.shape({
      transferMeta: PropTypes.shape({
        transferStatus: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default RejectTransferButton;
