/* eslint-disable react/prop-types */
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ITask, withTaskContext } from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../states';
import { updateForm } from '../../states/contacts/actions';
import CallerTabDefinition from '../../formDefinitions/tabbedForms/CallerInformationTab.json';
import { ColumnarBlock, Container, TwoColumnLayout } from '../../styles/HrmStyles';
import { createFormFromDefinition, disperseInputs, splitInHalf } from '../common/forms/formGenerators';
import type { FormDefinition } from '../common/forms/types';

type OwnProps = { task: ITask; display: boolean };

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ConnectedProps<typeof connector>;

const CallerInformationTab: React.FC<Props> = ({ dispatch, task, display }) => {
  const { getValues } = useFormContext();

  const [l, r] = React.useMemo(() => {
    const updateCallback = () => {
      const { callerInformation } = getValues();
      dispatch(updateForm(task.taskSid, 'callerInformation', callerInformation));
    };

    // TODO: fix this typecasting
    const callerFormDefinition = createFormFromDefinition(CallerTabDefinition as FormDefinition)(['callerInformation'])(
      updateCallback,
    );

    const margin = 12;
    return splitInHalf(disperseInputs(margin)(callerFormDefinition));
  }, [dispatch, getValues, task.taskSid]);

  return (
    <div style={{ display: display ? 'block' : 'none' }}>
      <Container>
        <TwoColumnLayout>
          <ColumnarBlock>{l}</ColumnarBlock>
          <ColumnarBlock>{r}</ColumnarBlock>
        </TwoColumnLayout>
      </Container>
    </div>
  );
};

CallerInformationTab.displayName = 'CallerInformationTab';

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({});

const connector = connect(mapStateToProps);
const connected = connector(CallerInformationTab);

export default withTaskContext<Props, typeof connected>(connected);
