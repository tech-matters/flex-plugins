import React from 'react';
import PropTypes from 'prop-types';
import { withTaskContext } from '@twilio/flex-ui';
import SearchIcon from '@material-ui/icons/Search';

import { TabbedFormsContainer, TopNav, TransparentButton, StyledTabs, StyledTab } from '../../styles/HrmStyles';
import callTypes from '../../states/DomainConstants';
import decorateTab from '../decorateTab';
import { formType, taskType } from '../../types';
import Search from '../search';
import CallerInformationTab from './CallerInformationTab';
import ChildInformationTab from './ChildInformationTab';
import IssueCategorizationTab from './IssueCategorizationTab';
import CaseInformationTab from './CaseInformationTab';
import BottomBar from './BottomBar';

const TabbedForms = props => {
  const { task, form } = props;
  const taskId = task.taskSid;

  const curriedHandleChange = (parents, name) => e =>
    props.handleChange(taskId, parents, name, e.target.value || e.currentTarget.value);

  const curriedHandleFocus = (parents, name) => () => props.handleFocus(taskId, parents, name);

  const defaultEventHandlers = (parents, name) => ({
    handleBlur: props.handleBlur,
    handleChange: curriedHandleChange(parents, name),
    handleFocus: curriedHandleFocus(parents, name),
  });

  const handleSelectSearchResult = searchResult => {
    props.handleSelectSearchResult(searchResult, taskId);

    // Redirects to the tab where data is being copied to
    const currentIsCaller = form.callType.value === callTypes.caller;
    const selectedIsChild = searchResult.details.callType === callTypes.child;
    const tab = currentIsCaller && selectedIsChild ? 2 : 1;

    props.changeTab(tab, taskId);
  };

  const handleCheckboxClick = (parents, name, value) => props.handleChange(taskId, parents, name, value);

  const handleTabsChange = (event, tab) => {
    props.changeTab(tab, taskId);
  };

  const { tab } = form.metadata;
  const isCallerType = form.callType.value === callTypes.caller;

  const body = [];

  body.push(
    <Search
      currentIsCaller={isCallerType}
      handleSelectSearchResult={searchResult => handleSelectSearchResult(searchResult)}
    />,
  );

  if (isCallerType) {
    body.push(
      <CallerInformationTab callerInformation={form.callerInformation} defaultEventHandlers={defaultEventHandlers} />,
    );
  }

  body.push(
    <ChildInformationTab
      childInformation={form.childInformation}
      handleCheckboxClick={handleCheckboxClick}
      defaultEventHandlers={defaultEventHandlers}
    />,
  );

  body.push(<IssueCategorizationTab form={form} taskId={taskId} handleCategoryToggle={props.handleCategoryToggle} />);

  body.push(
    <CaseInformationTab
      caseInformation={form.caseInformation}
      handleCheckboxClick={handleCheckboxClick}
      defaultEventHandlers={defaultEventHandlers}
    />,
  );

  /**
   * this is hokey
   * we need to be able to mark that the categories field has been touched
   * the only way to do this that I see is this.  Blech.
   */
  if (tab === 2 && !form.caseInformation.categories.touched) {
    props.handleFocus(taskId, ['caseInformation'], 'categories');
  }

  const tabs = [];
  tabs.push(<StyledTab searchTab key="Search" icon={<SearchIcon />} />);
  if (isCallerType) {
    tabs.push(decorateTab('Add Caller Information', form.callerInformation));
  }
  tabs.push(decorateTab('Add Child Information', form.childInformation));
  tabs.push(decorateTab('Categorize Issue', form.caseInformation.categories));
  tabs.push(<StyledTab key="Case Information" label="Add Case Summary" />);

  return (
    <TabbedFormsContainer>
      <TopNav>
        <TransparentButton onClick={e => props.handleCallTypeButtonClick(taskId, '')}>&lt; BACK</TransparentButton>
      </TopNav>
      <StyledTabs name="tab" variant="scrollable" scrollButtons="auto" value={tab} onChange={handleTabsChange}>
        {tabs}
      </StyledTabs>
      {body[tab]}
      <BottomBar tabs={tabs.length} form={form} changeTab={props.changeTab} handleSubmit={props.handleSubmit} />
    </TabbedFormsContainer>
  );
};

TabbedForms.displayName = 'TabbedForms';
TabbedForms.propTypes = {
  form: formType.isRequired,
  task: taskType.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleCategoryToggle: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCallTypeButtonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleSelectSearchResult: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
};

export default withTaskContext(TabbedForms);
