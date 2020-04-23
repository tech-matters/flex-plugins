import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

import { Box, Row } from '../../styles/HrmStyles';
import {
  QueueName,
  ChannelColumn,
  ChannelBox,
  ChannelLabel,
  WaitTimeLabel,
  WaitTimeValue,
} from '../../styles/queuesStatus';

class QueuesCard extends React.PureComponent {
  static displayName = 'QueuesCard';

  static propTypes = {
    qName: PropTypes.string.isRequired,
    facebook: PropTypes.number.isRequired,
    sms: PropTypes.number.isRequired,
    voice: PropTypes.number.isRequired,
    web: PropTypes.number.isRequired,
    whatsapp: PropTypes.number.isRequired,
    longestWaitingDate: PropTypes.string,
    colors: PropTypes.shape({
      voiceColor: PropTypes.shape({ Accepted: PropTypes.string }),
      webColor: PropTypes.shape({ Accepted: PropTypes.string }),
      facebookColor: PropTypes.shape({ Accepted: PropTypes.string }),
      smsColor: PropTypes.shape({ Accepted: PropTypes.string }),
      whatsappColor: PropTypes.shape({ Accepted: PropTypes.string }),
    }).isRequired,
  };

  static defaultProps = {
    longestWaitingDate: null,
  };

  state = {
    waitingMinutes: 0,
    intervalId: null,
  };

  componentDidMount() {
    if (this.props.longestWaitingDate) this.setNewInterval();
  }

  componentDidUpdate(prevProps, prevState) {
    const { longestWaitingDate } = this.props;

    if (prevProps.longestWaitingDate !== longestWaitingDate) {
      clearTimeout(prevState.intervalId);

      if (longestWaitingDate) {
        this.setNewInterval();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.intervalId);
  }

  setNewInterval = () => {
    const intervalId = setInterval(
      () => this.setState(prev => ({ waitingMinutes: prev.waitingMinutes + 1 })),
      60 * 1000,
    );

    this.setState({ intervalId, waitingMinutes: 0 });
  };

  renderChannel = (channel, color, value, marginLeft) => (
    <ChannelColumn marginLeft={marginLeft}>
      <ChannelBox backgroundColor={color}>{value}</ChannelBox>
      <ChannelLabel>{channel}</ChannelLabel>
    </ChannelColumn>
  );

  render() {
    const { qName, colors, facebook, sms, voice, web, whatsapp, longestWaitingDate } = this.props;
    const { voiceColor, smsColor, facebookColor, whatsappColor, webColor } = colors;
    const waitingMinutesMsg = longestWaitingDate === null ? 'none' : formatDistanceToNow(new Date(longestWaitingDate));

    return (
      <>
        <Box paddingLeft="10px" paddingTop="10px">
          <QueueName>{qName}</QueueName>
          <Box marginTop="7px" marginBottom="14px">
            <Row>
              {this.renderChannel('Calls', voiceColor.Accepted, voice, false)}
              {this.renderChannel('SMS', smsColor.Accepted, sms, true)}
              {this.renderChannel('FB', facebookColor.Accepted, facebook, true)}
              {this.renderChannel('WA', whatsappColor.Accepted, whatsapp, true)}
              {this.renderChannel('Chat', webColor.Accepted, web, true)}
            </Row>
          </Box>
          <Row>
            <WaitTimeLabel>Longest wait time:</WaitTimeLabel>
            <WaitTimeValue>{waitingMinutesMsg}</WaitTimeValue>
          </Row>
        </Box>
      </>
    );
  }
}

export default QueuesCard;
