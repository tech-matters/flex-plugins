import React from 'react';
import { Template } from '@twilio/flex-ui';
import { CircularProgress, Dialog, DialogContent } from '@material-ui/core';

import CaseListTable from './CaseListTable';
import { Box, HeaderContainer } from '../../styles/HrmStyles';
import { CaseListContainer, LoadingContainer } from '../../styles/caseList';
import { TLHPaddingLeft } from '../../styles/GlobalOverrides';
import { getCases } from '../../services/CaseService';

class CaseList extends React.PureComponent {
  static displayName = 'CaseList';

  state = {
    loading: true,
    caseList: [],
    page: 0,
    mockedMessage: null,
  };

  async componentDidMount() {
    const caseList = await getCases();
    console.log('HERE HERE HERE');
    console.log(caseList);
    this.setState({ caseList, loading: false });
  }

  handleChangePage = page => {
    this.setState({ page });
  };

  handleMockedMessage = () => this.setState({ mockedMessage: <Template code="NotImplemented" /> });

  closeMockedMessage = () => this.setState({ mockedMessage: null });

  render() {
    return (
      <>
        <Dialog onClose={this.closeMockedMessage} open={this.state.mockedMessage !== null}>
          <DialogContent>{this.state.mockedMessage}</DialogContent>
        </Dialog>
        <CaseListContainer>
          {this.state.loading ? (
            <LoadingContainer>
              <CircularProgress size={50} />
            </LoadingContainer>
          ) : (
            <>
              <HeaderContainer>
                <Box marginTop="15px" marginBottom="14px" marginLeft={TLHPaddingLeft} id="CaseList-AllCases-label">
                  <Template code="CaseList-AllCases" />
                </Box>
              </HeaderContainer>
              <CaseListTable
                caseList={this.state.caseList}
                page={this.state.page}
                handleChangePage={this.handleChangePage}
                handleMockedMessage={this.handleMockedMessage}
              />
            </>
          )}
        </CaseListContainer>
      </>
    );
  }
}

export default CaseList;
