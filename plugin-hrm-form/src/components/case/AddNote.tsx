/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Template, ITask } from '@twilio/flex-ui';
import { ButtonBase } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { getConfig } from '../../HrmFormPlugin';
import { Box, Row, HiddenText, StyledNextStepButton, BottomButtonBar } from '../../styles/HrmStyles';
import { AddNoteContainer, CaseActionTitle, CaseActionDetailFont, CaseActionTextArea } from '../../styles/case';
import { namespace, connectedCaseBase } from '../../states';
import * as CaseActions from '../../states/case/actions';
import * as RoutingActions from '../../states/routing/actions';
import { CaseState } from '../../states/case/reducer';

type OwnProps = {
  task: ITask;
  counselor: string;
  onClickClose: () => void;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const AddNote: React.FC<Props> = ({
  task,
  counselor,
  connectedCaseState,
  onClickClose,
  updateTempInfo,
  updateCaseInfo,
  changeRoute,
}) => {
  const { strings } = getConfig();
  const { connectedCase, temporaryCaseInfo } = connectedCaseState;

  const handleOnChangeNote = (newNote: string) => updateTempInfo(newNote, task.taskSid);

  const handleSaveNote = () => {
    const { info } = connectedCase;
    const newNoteObj = { note: temporaryCaseInfo, createdAt: new Date().toISOString() };
    const notes = info && info.notes ? [...info.notes, newNoteObj] : [newNoteObj];
    const newInfo = info ? { ...info, notes } : { notes };
    updateCaseInfo(newInfo, task.taskSid);
    changeRoute({ route: 'new-case' }, task.taskSid);
  };

  return (
    <AddNoteContainer>
      <Box height="100%" paddingTop="20px" paddingLeft="30px" paddingRight="10px">
        <Row>
          <CaseActionTitle style={{ marginTop: 'auto' }}>
            <Template code="Case-AddNote" />
          </CaseActionTitle>
          <ButtonBase onClick={onClickClose} style={{ marginLeft: 'auto' }} data-testid="Case-AddNoteScreen-CloseCross">
            <HiddenText>
              <Template code="Case-CloseButton" />
            </HiddenText>
            <Close />
          </ButtonBase>
        </Row>
        <Row>
          <CaseActionDetailFont style={{ marginRight: 20 }}>
            <Template code="Case-AddNoteAdded" /> {new Date().toLocaleDateString(navigator.language)}
          </CaseActionDetailFont>
          <CaseActionDetailFont style={{ marginRight: 20 }}>
            <Template code="Case-AddNoteCounselor" /> {counselor}
          </CaseActionDetailFont>
        </Row>
        <HiddenText id="Case-TypeHere-label">
          <Template code="Case-AddNoteTypeHere" />
        </HiddenText>
        <CaseActionTextArea
          data-testid="Case-AddNoteScreen-TextArea"
          aria-labelledby="Case-TypeHere-label"
          placeholder={strings['Case-AddNoteTypeHere']}
          rows={25}
          value={temporaryCaseInfo}
          onChange={e => handleOnChangeNote(e.target.value)}
        />
      </Box>
      <div style={{ width: '100%', height: 5, backgroundColor: '#ffffff' }} />
      <BottomButtonBar>
        <Box marginRight="15px">
          <StyledNextStepButton
            data-testid="Case-AddNoteScreen-CloseButton"
            secondary
            roundCorners
            onClick={onClickClose}
          >
            <Template code="BottomBar-Cancel" />
          </StyledNextStepButton>
        </Box>
        <StyledNextStepButton
          data-testid="Case-AddNoteScreen-SaveNote"
          roundCorners
          onClick={handleSaveNote}
          disabled={!temporaryCaseInfo}
        >
          <Template code="BottomBar-SaveNote" />
        </StyledNextStepButton>
      </BottomButtonBar>
    </AddNoteContainer>
  );
};

AddNote.displayName = 'AddNote';

const mapStateToProps = (state, ownProps: OwnProps) => {
  const caseState: CaseState = state[namespace][connectedCaseBase]; // casting type as inference is not working for the store yet
  const connectedCaseState = caseState.tasks[ownProps.task.taskSid];

  return { connectedCaseState };
};

const mapDispatchToProps = {
  updateTempInfo: CaseActions.updateTempInfo,
  updateCaseInfo: CaseActions.updateCaseInfo,
  changeRoute: RoutingActions.changeRoute,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);
