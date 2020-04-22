import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from '@material-ui/core';
import { ArrowDropDownTwoTone, ArrowDropUpTwoTone } from '@material-ui/icons';

import QueueCard from './QueueCard';
import { Container, HeaderContainer, QueuesContainer } from '../../styles/queuesStatus';
import { Box, ErrorText } from '../../styles/HrmStyles';
import { withQueuesContext } from '../../contexts/QueuesStatusContext';

class QueuesStatus extends React.Component {
  static displayName = 'QueuesStatus';

  static propTypes = {
    colors: PropTypes.shape({
      voiceColor: PropTypes.shape({ Accepted: PropTypes.string }),
      webColor: PropTypes.shape({ Accepted: PropTypes.string }),
      facebookColor: PropTypes.shape({ Accepted: PropTypes.string }),
      smsColor: PropTypes.shape({ Accepted: PropTypes.string }),
      whatsappColor: PropTypes.shape({ Accepted: PropTypes.string }),
    }).isRequired,
    queuesContext: PropTypes.shape({
      state: PropTypes.shape({
        queuesStatus: PropTypes.shape({}),
        error: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    expanded: true,
  };

  handleExpandClick = () => this.setState(prev => ({ expanded: !prev.expanded }));

  renderHeaderIcon = () => {
    return this.state.expanded ? (
      <ArrowDropUpTwoTone style={{ padding: 0, fontSize: 18 }} />
    ) : (
      <ArrowDropDownTwoTone style={{ padding: 0, fontSize: 18 }} />
    );
  };

  render() {
    const { queuesStatus, error } = this.props.queuesContext.state;
    const { expanded } = this.state;
    console.log('QUEUES READER', this.props.queuesContext)
    return (
      <>
        <Container>
          <HeaderContainer onClick={this.handleExpandClick} role="button">
            <Box marginTop="12px" marginRight="5px" marginBottom="12px" marginLeft="12px">
              Contacts waiting
            </Box>
            {this.renderHeaderIcon()}
          </HeaderContainer>
          <Collapse in={expanded} timeout="auto">
            <QueuesContainer>
              {error && <ErrorText>{error}</ErrorText>}
              {queuesStatus &&
                Object.entries(queuesStatus).map(([qName, qStatus]) => (
                  <QueueCard key={qName} qName={qName} qStatus={qStatus} colors={this.props.colors} />
                ))}
            </QueuesContainer>
          </Collapse>
        </Container>
      </>
    );
  }
}

export default withQueuesContext(QueuesStatus);
