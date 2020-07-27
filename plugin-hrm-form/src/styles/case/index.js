import styled from 'react-emotion';

import { FontOpenSans, Row } from '../HrmStyles';

export const CaseContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
CaseContainer.displayName = 'CaseContainer';

export const AddNoteContainer = styled(CaseContainer)`
  background-color: #ffffff;
`;
AddNoteContainer.displayName = 'AddNoteContainer';

export const CenteredContainer = styled(CaseContainer)`
  align-items: center;
  justify-content: center;
`;
CenteredContainer.displayName = 'CenteredContainer';

export const CaseNumberFont = styled(FontOpenSans)`
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  color: #0d2a38;
`;
CaseNumberFont.displayName = 'CaseNumberFont';

export const CaseSectionFont = styled(FontOpenSans)`
  color: #192b33;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.67px;
  line-height: 12px;
  text-transform: uppercase;
`;
CaseSectionFont.displayName = 'CaseSectionFont';

export const DetailsContainer = styled(Row)`
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  border-color: #a0a8bd52;
  padding: 15px;
  margin-top: 10px;
`;
DetailsContainer.displayName = 'DetailsContainer';

const DetailEntryText = styled(FontOpenSans)`
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
`;

export const DetailDescription = styled(DetailEntryText)`
  color: #9b9b9b;
`;
DetailDescription.displayName = 'DetailDescription';

export const DetailValue = DetailEntryText;
DetailValue.displayName = 'DetailValue';

export const OpenStatusFont = styled(DetailEntryText)`
  color: #2bb826;
  font-size: 13px;
  text-transform: uppercase;
`;
OpenStatusFont.displayName = 'OpenStatusFont';

export const DefaultStatusFont = styled(DetailEntryText)`
  font-size: 13px;
  text-transform: uppercase;
`;
DefaultStatusFont.displayName = 'DefaultStatusFont';

export const CaseAddButtonFont = styled(FontOpenSans)`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #1976d2;
`;
CaseAddButtonFont.displayName = 'CaseAddButtonFont';

export const CaseActionTitle = styled(FontOpenSans)`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #22333b;
`;
CaseActionTitle.displayName = 'CaseActionTitle';

export const CaseActionDetailFont = styled(FontOpenSans)`
  font-style: italic;
  font-size: 12px;
  line-height: 30px;
  opacity: 67%;
`;
CaseActionDetailFont.displayName = 'CaseActionDetailFont';

export const CaseActionTextArea = styled('textarea')`
  resize: none;
  width: 65%;
  background-color: ${props => props.theme.colors.base2};
  font-family: Open Sans;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  margin-top: 10px;
  padding: 5px;
  border-style: none;
  border-radius: 4px;
  :focus {
    outline: none;
  }
`;
CaseActionTextArea.displayName = 'CaseActionTextArea';
