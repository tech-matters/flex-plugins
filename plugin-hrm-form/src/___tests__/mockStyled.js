/*
 * File used to populate test's scope with mocked styled components
 * Should be imported before the components making use of the styled
 */

jest.mock('../Styles/HrmStyles', () => ({
  Container: 'Container',
  SearchFields: 'SearchFields',
  StyledSearchButton: 'StyledSearchButton',
  StyledLabel: 'StyledLabel',
  StyledInput: 'StyledInput',
  TextField: 'TextField',
  StyledMenuItem: 'StyledMenuItem',
  StyledSelect: 'StyledSelect',
  StyledTableCell: 'StyledTableCell',
  Row: 'Row',
  FontOpenSans: 'FontOpenSans',
}));

jest.mock('../Styles/search', () => ({
  AlertContainer: 'AlertContainer',
  ConfirmContainer: 'ConfirmContainer',
  ContactWrapper: 'ContactWrapper',
  ContactButtonsWrapper: 'ContactButtonsWrapper',
  NoneTransform: 'NoneTransform',
  ContactTag: 'ContactTag',
  CalltypeTag: 'CalltypeTag',
  ConfirmText: 'ConfirmText',
  AlertText: 'AlertText',
  NameText: 'NameText',
  SummaryText: 'SummaryText',
  CounselorText: 'CounselorText',
  DateText: 'DateText',
  TagText: 'TagText',
  RowWithMargin: () => 'RowWithMargin',
  StyledIcon: () => 'StyledIcon',
}));