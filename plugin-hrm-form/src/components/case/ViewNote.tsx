/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Template } from '@twilio/flex-ui';

import { Container, BottomButtonBar, StyledNextStepButton } from '../../styles/HrmStyles';
import { namespace, connectedCaseBase, configurationBase } from '../../states';
import { CaseState } from '../../states/case/reducer';
import * as RoutingActions from '../../states/routing/actions';
import { CaseContainer, NoteContainer } from '../../styles/case';
import ActionHeader from './ActionHeader';

type OwnProps = {
  taskSid: string;
};

const mapStateToProps = (state, ownProps: OwnProps) => {
  const caseState: CaseState = state[namespace][connectedCaseBase]; // casting type as inference is not working for the store yet
  const connectedCaseState = caseState.tasks[ownProps.taskSid];
  const counselorsHash = state[namespace][configurationBase].counselors.hash;

  return { connectedCaseState, counselorsHash };
};

const mapDispatchToProps = {
  changeRoute: RoutingActions.changeRoute,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const ViewNote: React.FC<Props> = ({ taskSid, connectedCaseState, changeRoute, counselorsHash }) => {
  const { counselor, date, note } = connectedCaseState.viewNoteInfo;
  const counselorName = counselorsHash[counselor] || 'Unknown';

  const handleClose = () => changeRoute({ route: 'new-case' }, taskSid);

  return (
    <CaseContainer>
      <Container>
        <ActionHeader titleTemplate="Case-Note" onClickClose={handleClose} counselor={counselorName} added={date} />
        <NoteContainer data-testid="Case-ViewNoteScreen-Note">{note}</NoteContainer>
      </Container>
      <BottomButtonBar>
        <StyledNextStepButton roundCorners onClick={handleClose} data-testid="Case-ViewNoteScreen-CloseButton">
          <Template code="CloseButton" />
        </StyledNextStepButton>
      </BottomButtonBar>
    </CaseContainer>
  );
};

ViewNote.displayName = 'ViewNote';

export const UnconnectedViewNote = ViewNote;
export default connect(mapStateToProps, mapDispatchToProps)(ViewNote);