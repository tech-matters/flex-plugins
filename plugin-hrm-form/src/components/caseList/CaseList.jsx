import React from 'react';
import { Template } from '@twilio/flex-ui';

import CaseListTable from './CaseListTable';
import { Box, HeaderContainer, Row } from '../../styles/HrmStyles';
import { CaseListContainer } from '../../styles/caseList';
import { TLHPaddingLeft } from '../../styles/GlobalOverrides';
import { getCases } from '../../services/CaseService';

class CaseList extends React.PureComponent {
  static displayName = 'CaseList';

  state = {
    caseList: [],
  };

  async componentDidMount() {
    const caseList = await getCases();
    console.log('HERE HERE HERE');
    console.log(caseList);
    this.setState({ caseList });
  }

  render() {
    return (
      <CaseListContainer>
        <HeaderContainer>
          <Box marginTop="15px" marginBottom="14px" marginLeft={TLHPaddingLeft} id="CaseList-AllCases-label">
            <Template code="CaseList-AllCases" />
          </Box>
        </HeaderContainer>
        <CaseListTable caseList={this.state.caseList} />
        <Row>
          <span style={{ margin: 3 }}>1</span>
          <span style={{ margin: 3 }}>2</span>
          <span style={{ margin: 3 }}>3</span>
          <span style={{ margin: 3 }}>4</span>
          <span style={{ margin: 3 }}>5</span>
          <span style={{ margin: 3 }}>6</span>
          <span style={{ margin: 3 }}>7</span>
          <span style={{ margin: 3 }}>8</span>
          <span style={{ margin: 3 }}>9</span>
          <span style={{ margin: 3 }}>...</span>
          <span style={{ margin: 3 }}>49</span>
          <span style={{ margin: 3 }}>50</span>
        </Row>
      </CaseListContainer>
    );
  }
}

export default CaseList;
