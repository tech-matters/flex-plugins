/* eslint-disable import/no-unused-modules */
import { Dispatch } from 'redux';

import * as t from './types';
import { ConfigurationState } from '../configuration/reducer';
import { updateDefinitionVersion } from '../configuration/actions';
import { Case, SearchContact } from '../../types/types';
import { searchContacts as searchContactsApiCall } from '../../services/ContactService';
import { searchCases as searchCasesApiCall } from '../../services/CaseService';
import { ContactDetailsSectionsType } from '../../components/common/ContactDetails';
import { addDetails } from './helpers';
import { getDefinitionVersions } from '../../HrmFormPlugin';
import { getMissingDefinitionVersions } from '../../services/ServerlessService';

// Action creators
export const handleSearchFormChange = (taskId: string) => <K extends keyof t.SearchFormValues>(
  name: K,
  value: t.SearchFormValues[K],
): t.SearchActionType => {
  return {
    type: t.HANDLE_SEARCH_FORM_CHANGE,
    name,
    value,
    taskId,
  } as t.SearchActionType; // casting cause inference is not providing enough information, but the restrictions are made in argument types
};

export const searchContacts = (dispatch: Dispatch<any>) => (taskId: string) => async (
  searchParams: any,
  counselorsHash: ConfigurationState['counselors']['hash'],
  limit: number,
  offset: number,
) => {
  try {
    dispatch({ type: t.SEARCH_CONTACTS_REQUEST, taskId });

    const searchResultRaw = await searchContactsApiCall(searchParams, limit, offset);
    const contactsWithCounselorName = addDetails(counselorsHash, searchResultRaw.contacts);
    const searchResult = { ...searchResultRaw, contacts: contactsWithCounselorName };

    // Look for not loaded definitionVersions
    const { definitionVersions } = getDefinitionVersions();
    const missingDefinitionVersions = Object.keys(
      searchResultRaw.contacts.reduce(
        (accum, c) =>
          definitionVersions[c.details.definitionVersion] ? accum : { ...accum, [c.details.definitionVersion]: true },
        {},
      ),
    );

    // Batch all the missing ones to global state (if any)
    const definitions = await getMissingDefinitionVersions(missingDefinitionVersions);
    definitions.forEach(d => dispatch(updateDefinitionVersion(d.version, d.definition)));

    dispatch({ type: t.SEARCH_CONTACTS_SUCCESS, searchResult, taskId });
  } catch (error) {
    dispatch({ type: t.SEARCH_CONTACTS_FAILURE, error, taskId });
  }
};

export const searchCases = (dispatch: Dispatch<any>) => (taskId: string) => async (
  searchParams: any,
  counselorsHash: ConfigurationState['counselors']['hash'],
  limit: number,
  offset: number,
) => {
  try {
    dispatch({ type: t.SEARCH_CASES_REQUEST, taskId });
    const searchResult = await searchCasesApiCall(searchParams, limit, offset);

    // Look for not loaded definitionVersions
    const { definitionVersions } = getDefinitionVersions();
    const missingDefinitionVersions = Object.keys(
      searchResult.cases.reduce(
        (accum, c) =>
          definitionVersions[c.info.definitionVersion] ? accum : { ...accum, [c.info.definitionVersion]: true },
        {},
      ),
    );

    // Batch all the missing ones to global state (if any)
    const definitions = await getMissingDefinitionVersions(missingDefinitionVersions);
    definitions.forEach(d => dispatch(updateDefinitionVersion(d.version, d.definition)));

    dispatch({ type: t.SEARCH_CASES_SUCCESS, searchResult, taskId });
  } catch (error) {
    dispatch({ type: t.SEARCH_CASES_FAILURE, error, taskId });
  }
};

/**
 * Updates a case in redux
 * @param taskId TaskId
 * @param updatedCase Case to update
 */
export const updateCases = (taskId: string, updatedCase: Case): t.SearchActionType => ({
  type: t.SEARCH_CASES_UPDATE,
  taskId,
  updatedCase,
});

export const changeSearchPage = (taskId: string) => (page: t.SearchPagesType): t.SearchActionType => ({
  type: t.CHANGE_SEARCH_PAGE,
  page,
  taskId,
});

export const viewContactDetails = (taskId: string) => (contact: SearchContact): t.SearchActionType => ({
  type: t.VIEW_CONTACT_DETAILS,
  contact,
  taskId,
});

export const handleExpandDetailsSection = (taskId: string) => (section: ContactDetailsSectionsType) => ({
  type: t.HANDLE_EXPAND_DETAILS_SECTION,
  section,
  taskId,
});
