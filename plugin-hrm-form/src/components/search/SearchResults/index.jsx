import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';

import ContactPreview from '../ContactPreview';
import { searchResultType } from '../../../types';
import { Row } from '../../../styles/HrmStyles';
import { BackIcon, BackText, ResultsHeader, ListContainer, ScrollableList } from '../../../styles/search';
import ConnectDialog from '../ConnectDialog';

class SearchResults extends Component {
  static displayName = 'SearchResults';

  static propTypes = {
    currentIsCaller: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(searchResultType).isRequired,
    handleSelectSearchResult: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleViewDetails: PropTypes.func.isRequired,
    handleMockedMessage: PropTypes.func.isRequired,
  };

  state = {
    currentContact: null,
  };

  handleCloseDialog = () => {
    this.setState({ anchorEl: null, currentContact: null });
  };

  handleConfirmDialog = () => {
    const { currentContact } = this.state;
    this.props.handleSelectSearchResult(currentContact);
  };

  /**
   * Captures the contact of each preview and the event that fired it
   * so we can "pop over" the pressed button
   * @param {any} currentContact
   * @returns {(e: React.MouseEvent<HTMLElement, MouseEvent>) => void}
   */
  handleOpenConnectDialog = currentContact => e => {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget, currentContact });
  };

  render() {
    const { currentContact } = this.state;
    const { currentIsCaller, results } = this.props;
    const resultsCount = results.length;

    // TODO (Gian): This should be a virtualized list instead (for performance reasons)
    return (
      <>
        <ResultsHeader>
          <Row>
            <ButtonBase onClick={this.props.handleBack}>
              <BackIcon />
              <BackText>Return to search criteria</BackText>
            </ButtonBase>
          </Row>
          <Row style={{ paddingLeft: '24px' }}>
            <BackText>
              {resultsCount} result{resultsCount !== 1 && 's'}
            </BackText>
          </Row>
        </ResultsHeader>
        <ConnectDialog
          anchorEl={this.state.anchorEl}
          currentIsCaller={currentIsCaller}
          contact={currentContact}
          handleConfirm={this.handleConfirmDialog}
          handleClose={this.handleCloseDialog}
        />
        <ListContainer>
          <ScrollableList>
            {this.props.results.map(contact => (
              <ContactPreview
                key={contact.contactId}
                contact={contact}
                handleOpenConnectDialog={this.handleOpenConnectDialog(contact)}
                handleViewDetails={() => this.props.handleViewDetails(contact)}
                handleMockedMessage={this.props.handleMockedMessage}
              />
            ))}
          </ScrollableList>
        </ListContainer>
      </>
    );
  }
}

export default SearchResults;
