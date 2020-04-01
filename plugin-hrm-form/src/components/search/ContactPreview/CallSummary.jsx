import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { RowWithMargin, SummaryText, NoneTransform } from '../../../Styles/search';

const StyledRow = RowWithMargin(5);

class CallSummary extends React.Component {
  static displayName = 'CallSummary';

  static propTypes = {
    callSummary: PropTypes.string.isRequired,
    onClickFull: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
  };

  shortSummary = (this.props.callSummary && this.props.callSummary.substr(0, 55)) || '- No call summary -';

  formattedShortSummary = this.shortSummary.replace(/\n/gi, ' ').padEnd(55, ' ');

  isLong = this.shortSummary.length === 55;

  handleClick = bool => event => {
    event.stopPropagation();
    this.setState({ expanded: bool });
  };

  render() {
    return this.state.expanded ? (
      <div>
        <SummaryText>{this.props.callSummary}</SummaryText>
        <Button size="small" color="primary" onClick={this.props.onClickFull}>
          <NoneTransform>See full record</NoneTransform>
        </Button>
      </div>
    ) : (
      <StyledRow>
        <SummaryText>
          {this.formattedShortSummary}
          {this.isLong && '...'}
        </SummaryText>
        {this.isLong && (
          <Button size="small" color="primary" onClick={this.handleClick(true)}>
            <NoneTransform>more notes</NoneTransform>
          </Button>
        )}
      </StyledRow>
    );
  }
}

export default CallSummary;
