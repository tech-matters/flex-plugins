import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, List, Paper, Popover } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

// import SearchResultDetails from './SearchResultDetails';
import ContactPreview from './ContactPreview';
import { searchContactResult } from '../../types';
import { Row } from '../../Styles/HrmStyles';
import { ConfirmPopoverText } from '../../Styles/search';

class SearchResults extends Component {
  static displayName = 'SearchResults';

  static propTypes = {
    results: PropTypes.arrayOf(searchContactResult).isRequired,
    handleSelectSearchResult: PropTypes.func.isRequired,
  };

  state = {
    selectedSumary: '',
    anchorEl: null,
    contact: null,
  };

  closeDialog = () => this.setState({ selectedSumary: '' });

  handleClickSummary = selectedSumary => this.setState({ selectedSumary });

  renderSummaryDialog() {
    const isOpen = Boolean(this.state.selectedSumary);

    return (
      <Dialog onClose={this.closeDialog} open={isOpen}>
        <DialogTitle id="simple-dialog-title">Selected Summary</DialogTitle>
        <DialogContent>{this.state.selectedSumary}</DialogContent>
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
      this.props.handleSelectSearchResult(this.state.contact);
    };

    return (
      <Popover
        id={id}
        open={isOpen}
        anchorEl={this.state.anchorEl}
        // onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 30,
            paddingTop: 60,
            paddingBottom: 60,
          }}
        >
          <ConfirmPopoverText>{msg}</ConfirmPopoverText>
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
        </Paper>
      </Popover>
    );
  };

  // captures the contact of each preview and the event so we can "pop over" the pressed button
  handleConnectConfirm = contact => e => {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget, contact });
  };

  render() {
    if (this.props.results.length === 0) {
      return null;
    }

    // TODO (Gian): This should be a virtualized list instead (for performance reasons)
    return (
      <>
        <List>
          {this.renderSummaryDialog()}
          {this.renderConfirmPopover()}
          {this.props.results.map(contact => (
            <ContactPreview
              key={contact.contactId}
              contact={contact}
              onClick={this.handleClickSummary}
              handleConnect={this.handleConnectConfirm(contact)}
            />
          ))}
        </List>
      </>
    );
  }
}

export default SearchResults;
