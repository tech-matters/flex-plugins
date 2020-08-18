import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format } from 'date-fns';
import { Template } from '@twilio/flex-ui';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import TimelineIcon from './TimelineIcon';
import { CaseSectionFont, ViewButton, TimelineRow, TimelineDate, TimelineText } from '../../styles/case';
import { Box, Row } from '../../styles/HrmStyles';
import { taskType, formType } from '../../types';
import { isNullOrUndefined } from '../../utils/checkers';
import CaseAddButton from './CaseAddButton';
import { getActivities } from '../../services/CaseService';
import * as CaseActions from '../../states/case/actions';
import * as RoutingActions from '../../states/routing/actions';
import { ContactDetailsSections } from '../../states/SearchContact';
import { getConfig } from '../../HrmFormPlugin';

const Timeline = ({ task, form, caseId, changeRoute, updateViewNoteInfo, updateTempInfo }) => {
  const [mockedMessage, setMockedMessage] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    async function updateTimeline() {
      const activities = await getActivities(caseId);
      setTimeline(activities);
    }

    updateTimeline();
  }, [caseId]);

  const isCreatingCase = isNullOrUndefined(
    timeline.find(activity => ['whatsapp', 'facebook', 'web', 'sms'].includes(activity.type)),
  );
  if (isCreatingCase) {
    const { workerSid } = getConfig();
    const connectCaseActivity = {
      date: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
      type: task.channelType,
      text: form.caseInformation.callSummary.value,
      counselor: workerSid,
    };

    setTimeline([...timeline, connectCaseActivity]);
  }

  const handleOnClickView = activity => {
    const { counselor } = activity;
    const date = new Date(activity.date).toLocaleDateString(navigator.language);

    if (activity.type === 'note') {
      const info = {
        note: activity.text,
        counselor,
        date,
      };
      updateViewNoteInfo(info, task.taskSid);
      changeRoute({ route: 'new-case', subroute: 'view-note' }, task.taskSid);
    } else if (['whatsapp', 'facebook', 'sms', 'web'].includes(activity.type)) {
      const detailsExpanded = {
        [ContactDetailsSections.GENERAL_DETAILS]: true,
        [ContactDetailsSections.CALLER_INFORMATION]: false,
        [ContactDetailsSections.CHILD_INFORMATION]: false,
        [ContactDetailsSections.ISSUE_CATEGORIZATION]: false,
        [ContactDetailsSections.CASE_SUMMARY]: false,
      };
      const { contactId } = activity;
      const tempInfo = { detailsExpanded, contactId, date, counselor };
      updateTempInfo(tempInfo, task.taskSid);
      changeRoute({ route: 'new-case', subroute: 'view-contact' }, task.taskSid);
    } else {
      setMockedMessage(<Template code="NotImplemented" />);
    }
  };

  const handleAddNoteClick = () => changeRoute({ route: 'new-case', subroute: 'add-note' }, task.taskSid);

  return (
    <Box marginTop="25px">
      <Dialog onClose={() => setMockedMessage(null)} open={Boolean(mockedMessage)}>
        <DialogContent>{mockedMessage}</DialogContent>
      </Dialog>
      <Box marginBottom="10px">
        <Row>
          <CaseSectionFont id="Case-TimelineSection-label">
            <Template code="Case-TimelineSection" />
          </CaseSectionFont>
          <CaseAddButton templateCode="Case-AddNote" onClick={handleAddNoteClick} />
        </Row>
      </Box>
      {timeline
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((activity, index) => {
          const date = new Date(activity.date).toLocaleDateString(navigator.language);
          return (
            <TimelineRow key={index}>
              <TimelineDate>{date}</TimelineDate>
              <TimelineIcon type={activity.type} />
              <TimelineText>{activity.text}</TimelineText>
              <Box marginLeft="auto" marginRight="10px">
                <ViewButton onClick={() => handleOnClickView(activity)}>View</ViewButton>
              </Box>
            </TimelineRow>
          );
        })}
    </Box>
  );
};

Timeline.displayName = 'Timeline';
Timeline.propTypes = {
  task: taskType.isRequired,
  form: formType.isRequired,
  caseId: PropTypes.number.isRequired,
  changeRoute: PropTypes.func.isRequired,
  updateViewNoteInfo: PropTypes.func.isRequired,
  updateTempInfo: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  changeRoute: bindActionCreators(RoutingActions.changeRoute, dispatch),
  updateViewNoteInfo: bindActionCreators(CaseActions.updateViewNoteInfo, dispatch),
  updateTempInfo: bindActionCreators(CaseActions.updateTempInfo, dispatch),
});

export default connect(null, mapDispatchToProps)(Timeline);
