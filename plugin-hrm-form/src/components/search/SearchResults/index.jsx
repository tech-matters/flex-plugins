import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, List, Popover } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import ContactPreview from '../ContactPreview';
import { searchResultType } from '../../../types';
import { Row } from '../../../Styles/HrmStyles';
import { AlertContainer, AlertText, ConfirmContainer, ConfirmText } from '../../../Styles/search';

class SearchResults extends Component {
  static displayName = 'SearchResults';

  static propTypes = {
    results: PropTypes.arrayOf(searchResultType).isRequired,
    handleSelectSearchResult: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleViewDetails: PropTypes.func.isRequired,
  };

  state = {
    mockedMessage: '',
    anchorEl: null,
    contact: null,
    connected: false,
  };

  closeDialog = () => this.setState({ mockedMessage: '' });

  handleClickMock = mockedMessage => this.setState({ mockedMessage });

  renderMockDialog() {
    const isOpen = Boolean(this.state.mockedMessage);

    return (
      <Dialog onClose={this.closeDialog} open={isOpen}>
        <DialogContent>{this.state.mockedMessage}</DialogContent>
      </Dialog>
    );
  }

  renderConfirmPopover = () => {
    const isOpen = Boolean(this.state.anchorEl);
    const id = isOpen ? 'simple-popover' : undefined;
    const msg = "Connect current caller's record with this record?";

    const handleClose = () => {
      this.setState({ anchorEl: null, contact: null });
    };

    const handleConfirm = () => {
      const { contact } = this.state;
      this.setState({ connected: true });
      setTimeout(() => {
        this.setState({ anchorEl: null, contact: null, connected: false });
        this.props.handleSelectSearchResult(contact);
      }, 1000);
    };

    return (
      <Popover
        id={id}
        open={isOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {this.state.connected ? (
          <AlertContainer>
            <CheckIcon style={{ color: '#fff' }} />
            <AlertText>Connected!</AlertText>
          </AlertContainer>
        ) : (
          <ConfirmContainer>
            <ConfirmText>{msg}</ConfirmText>
            <Row>
              <Button variant="text" size="medium" onClick={handleClose}>
                cancel
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={handleConfirm}
                style={{ backgroundColor: '#000', color: '#fff', marginLeft: 20 }}
              >
                <CheckIcon />
                yes, connect
              </Button>
            </Row>
          </ConfirmContainer>
        )}
      </Popover>
    );
  };

  /**
   * Captures the contact of each preview and the event that fired it
   * so we can "pop over" the pressed button
   * @param {any} contact
   * @returns {(e: React.MouseEvent<HTMLElement, MouseEvent>) => void}
   */
  handleConnectConfirm = contact => e => {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget, contact });
  };

  render() {
    // TODO (Gian): This should be a virtualized list instead (for performance reasons)
    return (
      <>
        <button type="button" onClick={this.props.handleBack}>
          Back
        </button>
        <List>
          {this.renderMockDialog()}
          {this.renderConfirmPopover()}
          {this.props.results.map(contact => (
            <ContactPreview
              key={contact.contactId}
              contact={contact}
              onClick={this.handleClickMock}
              handleConnect={this.handleConnectConfirm(contact)}
              handleViewDetails={() => this.props.handleViewDetails(contact)}
            />
          ))}
        </List>
      </>
    );
  }
}

export default SearchResults;