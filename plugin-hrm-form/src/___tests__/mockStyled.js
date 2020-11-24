/*
 * File used to populate test's scope with mocked styled components
 * Should be imported before the components making use of the styled
 */

jest.mock('../styles/HrmStyles', () => ({
  Container: 'Container',
  SearchFields: 'SearchFields',
  StyledNextStepButton: 'StyledNextStepButton',
  BottomButtonBar: 'BottomButtonBar',
  StyledLabel: 'StyledLabel',
  StyledInput: 'StyledInput',
  TextField: 'TextField',
  StyledMenuItem: 'StyledMenuItem',
  StyledSelect: 'StyledSelect',
  StyledTableCell: 'StyledTableCell',
  Row: 'Row',
  PaginationRow: 'PaginationRow',
  FontOpenSans: 'FontOpenSans',
  Box: 'Box',
  Flex: 'Flex',
  StyledIcon: () => 'StyledIcon',
  addHover: () => 'ComponentWithHover',
  HiddenText: 'HiddenText',
  Absolute: 'Absolute',
}));

jest.mock('../styles/search', () => ({
  ConfirmContainer: 'ConfirmContainer',
  ContactWrapper: 'ContactWrapper',
  ConnectIcon: 'ConnectIcon',
  ContactButtonsWrapper: 'ContactButtonsWrapper',
  StyledLink: 'StyledLink',
  ContactTag: 'ContactTag',
  CalltypeTag: 'CalltypeTag',
  ConfirmText: 'ConfirmText',
  PrevNameText: 'PrevNameText',
  SummaryText: 'SummaryText',
  ShortSummaryText: 'ShortSummaryText',
  CounselorText: 'CounselorText',
  DateText: 'DateText',
  TagText: 'TagText',
  TagMiddleDot: 'TagMiddleDot',
  TagsWrapper: 'TagsWrapper',
  ContactDetailsIcon: () => 'ContactDetailsIcon',
  DetailsContainer: 'DetailsContainer',
  SectionTitleContainer: 'SectionTitleContainer',
  NameContainer: 'NameContainer',
  BoldDetailFont: 'BoldDetailFont',
  BackIcon: 'BackIcon',
  BackText: 'BackText',
  DetNameText: 'DetNameText',
  SectionTitleText: 'SectionTitleText',
  BodyText: 'BodyText',
  SectionDescriptionText: 'SectionDescriptionText',
  SectionValueText: 'SectionValueText',
  ResultsHeader: 'ResultsHeader',
  ListContainer: 'ListContainer',
  ScrollableList: 'ScrollableList',
  CancelButton: 'CancelButton',
  StyledButtonBase: 'StyledButtonBase',
  SilentText: 'SilentText',
  StyledFormControlLabel: 'StyledFormControlLabel',
  StyledSwitch: 'StyledSwitch',
  SwitchLabel: 'SwitchLabel',
  StyledLink: 'StyledLink',
  StyledTabs: 'StyledTabs',
  StyledResultsContainer: 'StyledResultsContainer',
  StyledResultsText: 'StyledResultsText',
  StyledTabLabel: 'StyledTabLabel',
  StyledFolderIcon: 'StyledFolderIcon',
  BoldText: 'BoldText',
  SearchResults: 'SearchResults',
  CaseHeaderContainer: 'CaseHeaderContainer',
  CaseHeaderCaseId: 'CaseHeaderCaseId',
  CaseHeaderChildName: 'CaseHeaderChildName',
  CaseSummaryContainer: 'CaseSummaryContainer',
  CaseWrapper: 'CaseWrapper',
}));

jest.mock('../styles/callTypeButtons', () => ({
  Container: 'Container',
  Label: 'Label',
  DataCallTypeButton: 'DataCallTypeButton',
  NonDataCallTypeButton: 'NonDataCallTypeButton',
  CloseTaskDialog: 'CloseTaskDialog',
  CloseTaskDialogText: 'CloseTaskDialogText',
  ConfirmButton: 'ConfirmButton',
  CancelButton: 'CancelButton',
  CloseButton: 'CloseButton',
  NonDataCallTypeDialogContainer: 'NonDataCallTypeDialogContainer',
}));

jest.mock('../styles/queuesStatus', () => ({
  Container: 'Container',
  HeaderContainer: 'HeaderContainer',
  QueuesContainer: 'QueuesContainer',
  QueueName: 'QueueName',
  ChannelColumn: 'ChannelColumn',
  ChannelBox: 'ChannelBox',
  ChannelLabel: 'ChannelLabel',
  WaitTimeLabel: 'WaitTimeLabel',
  WaitTimeValue: 'WaitTimeValue',
}));
