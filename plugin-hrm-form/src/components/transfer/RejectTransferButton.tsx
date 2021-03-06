/* eslint-disable react/prop-types */
import React from 'react';
import { TaskHelper, Template, ITask, ThemeProps } from '@twilio/flex-ui';

import { TransferStyledButton } from '../../styles/HrmStyles';
import { closeCallSelf } from '../../utils/transfer';

const handleRejectTransfer = async (task: ITask) => {
  if (TaskHelper.isChatBasedTask(task)) return; // this case should never happen

  await closeCallSelf(task);
};

type Props = ThemeProps & { task: ITask };

const RejectTransferButton: React.FC<Props> = ({ theme, task }) => {
  return (
    <TransferStyledButton
      color={theme.colors.base11}
      background={theme.colors.base1}
      taller
      onClick={() => handleRejectTransfer(task)}
    >
      <Template code="Transfer-RejectTransferButton" />
    </TransferStyledButton>
  );
};

RejectTransferButton.displayName = 'RejectTransferButton';

export default RejectTransferButton;
