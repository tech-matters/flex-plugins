import styled from 'react-emotion';
import { transparentize } from 'polished';

import { FontOpenSans, Row } from '../HrmStyles';

export const Container = styled('div')`
  width: 300px;
  background-color: #ffffff;
  padding: 5px;
`;

export const HeaderContainer = styled(Row)`
  width: auto;
  justify-items: flex-start;
  background-color: #f6f6f6;
  border-radius: 2px;
  text-transform: uppercase;
  color: #192b33;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.67px;
  line-height: 12px;
`;

export const QueuesContainer = styled('div')`
  width: auto;
`;

export const QueueName = styled(FontOpenSans)`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  padding-left: 2px;
`;

export const ChannelColumn = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${props => props.marginLeft && 'margin-left: 3px;'}
`;

export const ChannelBox = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 26px;
  background-color: ${props => transparentize('0.85', props.backgroundColor)};
  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
  margin-bottom: 5px;
`;

export const ChannelLabel = styled(FontOpenSans)`
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
`;

const WaitTimeText = styled(FontOpenSans)`
  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
`;

export const WaitTimeLabel = styled(WaitTimeText)`
  opacity: 0.46;
  margin-right: 1em;
`;

export const WaitTimeValue = styled(WaitTimeText)`
  color: #192b33;
`;