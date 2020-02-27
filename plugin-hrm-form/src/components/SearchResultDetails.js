import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableCell } from '../Styles/HrmStyles';

class SearchResultDetails extends Component {
  static displayName = 'SearchResultDetails';

  static propTypes = {
    details: PropTypes.shape({
      childInformation: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        gender: PropTypes.string,
        age: PropTypes.string,
        language: PropTypes.string,
        nationality: PropTypes.string,
        ethnicity: PropTypes.string,
        refugee: PropTypes.bool,
        streetAddress: PropTypes.string,
        city: PropTypes.string,
        stateOrCounty: PropTypes.string,
        postalCode: PropTypes.string,
        phone1: PropTypes.string,
        phone2: PropTypes.string,
      }),
      caseInformation: PropTypes.shape({
        callSummary: PropTypes.string,
        referredTo: PropTypes.string,
        status: PropTypes.string,
        keepConfidential: PropTypes.bool,
        okForCaseWorkerToCall: PropTypes.bool,
        howDidTheChildHearAboutUs: PropTypes.string,
        didYouDiscussRightsWithTheChild: PropTypes.bool,
        didTheChildFeelWeSolvedTheirProblem: PropTypes.bool,
        wouldTheChildRecommendUsToAFriend: PropTypes.bool,
      }),
    }).isRequired,
  };

  state = {
    tab: 0,
  };

  renderChildInformationDetails(childInformation) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <StyledTableCell>First Name</StyledTableCell>
            <StyledTableCell>{childInformation.firstName}</StyledTableCell>
            <StyledTableCell>Street Address</StyledTableCell>
            <StyledTableCell>{childInformation.streetAddress}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Last Name</StyledTableCell>
            <StyledTableCell>{childInformation.lastName}</StyledTableCell>
            <StyledTableCell>City</StyledTableCell>
            <StyledTableCell>{childInformation.city}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Gender</StyledTableCell>
            <StyledTableCell>{childInformation.gender}</StyledTableCell>
            <StyledTableCell>State/Country</StyledTableCell>
            <StyledTableCell>{childInformation.stateOrCountry}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Age</StyledTableCell>
            <StyledTableCell>{childInformation.age}</StyledTableCell>
            <StyledTableCell>Postal Code</StyledTableCell>
            <StyledTableCell>{childInformation.postalCode}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Language</StyledTableCell>
            <StyledTableCell>{childInformation.language}</StyledTableCell>
            <StyledTableCell>Phone #1</StyledTableCell>
            <StyledTableCell>{childInformation.phone1}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Nationality</StyledTableCell>
            <StyledTableCell>{childInformation.nationality}</StyledTableCell>
            <StyledTableCell>Phone #2</StyledTableCell>
            <StyledTableCell>{childInformation.phone2}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Ethnicity</StyledTableCell>
            <StyledTableCell>{childInformation.ethnicity}</StyledTableCell>
            <StyledTableCell>Refugee?</StyledTableCell>
            <StyledTableCell>{childInformation.refugee ? 'Yes' : 'No'}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  renderCaseInformation(caseInformation) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <StyledTableCell>Call Summary</StyledTableCell>
            <StyledTableCell>{caseInformation.callSummary}</StyledTableCell>
            <StyledTableCell>Referred To</StyledTableCell>
            <StyledTableCell>{caseInformation.referredTo}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>{caseInformation.status}</StyledTableCell>
            <StyledTableCell>Keep Confidential</StyledTableCell>
            <StyledTableCell>{caseInformation.keepConfidential ? 'Yes' : 'No'}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Ok For Case Worker To Call?</StyledTableCell>
            <StyledTableCell>{caseInformation.okForCaseWorkerToCall ? 'Yes' : 'No'}</StyledTableCell>
            <StyledTableCell>How Did The Child Hear About Us?</StyledTableCell>
            <StyledTableCell>{caseInformation.howDidTheChildHearAboutUs}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Did You Discuss Rights With The Child?</StyledTableCell>
            <StyledTableCell>{caseInformation.didYouDiscussRightsWithTheChild ? 'Yes' : 'No'}</StyledTableCell>
            <StyledTableCell>Did The Child Feel We Solved Their Problem?</StyledTableCell>
            <StyledTableCell>{caseInformation.didTheChildFeelWeSolvedTheirProblem ? 'Yes' : 'No'}</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Would The Child Recommend Us To A Friend?</StyledTableCell>
            <StyledTableCell>{caseInformation.wouldTheChildRecommendUsToAFriend ? 'Yes' : 'No'}</StyledTableCell>
            <StyledTableCell />
            <StyledTableCell />
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  handleTabChange = (event, tab) => this.setState({ tab });

  render() {
    const body = [];

    body.push(this.renderChildInformationDetails(this.props.details.childInformation));
    body.push(<div>Issue Categorization Details</div>);
    body.push(this.renderCaseInformation(this.props.details.caseInformation));

    return (
      <>
        <Tabs name="tab" value={this.state.tab} onChange={this.handleTabChange} centered>
          <Tab key="childInformation" label="Child Information" />
          <Tab key="issueCategorization" label="Issue Categorization" />
          <Tab key="caseInformation" label="Case Information" />
        </Tabs>
        {body[this.state.tab]}
      </>
    );
  }
}

export default SearchResultDetails;
