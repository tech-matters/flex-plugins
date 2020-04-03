import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Card, CardContent } from '@material-ui/core';

import { ContactWrapper } from '../../../Styles/search';
import ChildNameAndActions from './ChildNameAndActions';
import CallTypeAndCounselor from './CallTypeAndCounselor';
import CallSummary from './CallSummary';
import DateAndTags from './DateAndTags';
import { contactType } from '../../../types';
import { formatName, mapCallType } from '../../../utils';
import { isNonDataCallType } from '../../../states/ValidationRules';

const ContactPreview = ({ contact, handleConnect, handleViewDetails, handleMockedMessage }) => {
  const name = formatName(contact.overview.name).toUpperCase();

  const dateString = `${format(new Date(contact.overview.dateTime), 'MMM d, yyyy h:mm aaaaa')}m`;
  const callType = mapCallType(contact.overview.callType);
  const isNonDataContact = isNonDataCallType(contact.overview.callType);
  const { counselor } = contact;

  const { callSummary } = contact.details.caseInformation;

  const [tag1, tag2, tag3] = contact.tags;

  return (
    <ContactWrapper key={contact.contactId}>
      <Card>
        <CardContent>
          <ChildNameAndActions
            name={name}
            isNonDataContact={isNonDataContact}
            onClickChain={handleConnect}
            onClickFull={handleViewDetails}
            onClickMore={handleMockedMessage}
          />
          <CallTypeAndCounselor callType={callType} counselor={counselor} />
          <CallSummary callSummary={callSummary} onClickFull={handleViewDetails} />
          <DateAndTags dateString={dateString} tag1={tag1} tag2={tag2} tag3={tag3} />
        </CardContent>
      </Card>
    </ContactWrapper>
  );
};

ContactPreview.displayName = 'ContactPreview';

ContactPreview.propTypes = {
  contact: contactType.isRequired,
  handleConnect: PropTypes.func.isRequired,
  handleViewDetails: PropTypes.func.isRequired,
  handleMockedMessage: PropTypes.func.isRequired,
};

export default ContactPreview;
