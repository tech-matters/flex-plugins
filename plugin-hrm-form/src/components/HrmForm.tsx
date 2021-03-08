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

type OwnProps = {
  task: ITask;
  changeRoute: any;
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
      return <TabbedForms />;

    case 'new-case':
      return (
        <CaseLayout>
          <Case task={props.task} isCreating={true} />
        </CaseLayout>
      );

    case 'select-call-type':
    default:
      return <CallTypeButtons />;
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

// @ts-ignore
export default withTaskContext(connect(mapStateToProps, mapDispatchToProps)(HrmForm));
