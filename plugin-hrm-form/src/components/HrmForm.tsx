/* eslint-disable react/prop-types */
import React from 'react';
import { withTaskContext, ITask } from '@twilio/flex-ui';
import { connect } from 'react-redux';

import { CaseLayout } from '../styles/case';
import CallTypeButtons from './callTypeButtons';
import TabbedForms from './tabbedForms';
import Case from './case';
import { namespace, RootState, routingBase } from '../states';
import * as RoutingActions from '../states/routing/actions';
import type { CustomITask } from '../types/types';

type OwnProps = {
  task: CustomITask;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const HrmForm: React.FC<Props> = ({ routing, task }) => {
  if (!routing) return null;
  const { route } = routing;

  switch (route) {
    case 'tabbed-forms':
      return <TabbedForms task={task} />;

    case 'new-case':
      return (
        <CaseLayout>
          <Case task={task} isCreating={true} />
        </CaseLayout>
      );

    case 'select-call-type':
    default:
      return <CallTypeButtons task={task} />;
  }
};

HrmForm.displayName = 'HrmForm';

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const routingState = state[namespace][routingBase];

  return { routing: routingState.tasks[ownProps.task.taskSid] };
};

const mapDispatchToProps = {
  changeRoute: RoutingActions.changeRoute,
};

export default connect(mapStateToProps, null)(HrmForm);
