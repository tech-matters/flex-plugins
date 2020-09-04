import * as t from '../../../states/search/types';
import * as actions from '../../../states/search/actions';
import { addDetails } from '../../../states/search/helpers';
import { SearchContactResult } from '../../../types/types';
import { searchContacts } from '../../../services/ContactService';

jest.mock('../../../services/ContactService', () => ({ searchContacts: jest.fn() }));
jest.mock('../../../states/search/helpers', () => ({ addDetails: jest.fn((_hash, xs) => xs) }));

const task = { taskSid: 'WT123' };
const taskId = task.taskSid;

describe('test action creators', () => {
  test('changeSearchPage', () => {
    expect(actions.changeSearchPage(taskId)('details')).toStrictEqual({
      type: t.CHANGE_SEARCH_PAGE,
      taskId,
      page: t.SearchPages.details,
    });
    expect(actions.changeSearchPage(task.taskSid)('form')).toStrictEqual({
      type: t.CHANGE_SEARCH_PAGE,
      taskId,
      page: t.SearchPages.form,
    });
    expect(actions.changeSearchPage(task.taskSid)('results')).toStrictEqual({
      type: t.CHANGE_SEARCH_PAGE,
      taskId,
      page: t.SearchPages.results,
    });
  });

  test('handleExpandDetailsSection', () => {
    expect(actions.handleExpandDetailsSection(taskId)(t.ContactDetailsSections.CALLER_INFORMATION)).toStrictEqual({
      type: t.HANDLE_EXPAND_DETAILS_SECTION,
      taskId,
      section: t.ContactDetailsSections.CALLER_INFORMATION,
    });
  });

  test('handleSearchFormChange', () => {
    expect(actions.handleSearchFormChange(taskId)('firstName', 'Some name')).toStrictEqual({
      type: t.HANDLE_SEARCH_FORM_CHANGE,
      taskId,
      name: 'firstName',
      value: 'Some name',
    });
  });

  test('viewContactDetails', () => {
    const contact: unknown = { contactId: 'fake contact', overview: {}, details: {}, counselor: '', tags: [] };
    const typedContact = contact as SearchContactResult; // type casting to avoid writing an entire SearchContactResult

    expect(actions.viewContactDetails(taskId)(typedContact)).toStrictEqual({
      type: t.VIEW_CONTACT_DETAILS,
      taskId,
      contact: typedContact,
    });
  });

  test('searchContacts (succes)', async () => {
    const contact = { contactId: 'fake contact', overview: {}, details: {}, counselor: '', tags: [] };

    const searchResult = [contact];
    // @ts-ignore
    searchContacts.mockReturnValueOnce(Promise.resolve(searchResult));
    const dispatch = jest.fn();

    await actions.searchContacts(dispatch)(taskId)(null, null);

    expect(dispatch).toBeCalledTimes(2);
    expect(dispatch).toBeCalledWith({ type: t.SEARCH_CONTACTS_REQUEST, taskId });
    expect(dispatch).toBeCalledWith({ type: t.SEARCH_CONTACTS_SUCCESS, taskId, searchResult });
  });

  test('searchContacts (failure)', async () => {
    const error = new Error('Testing failure');
    // @ts-ignore
    searchContacts.mockReturnValueOnce(Promise.reject(error));
    const dispatch = jest.fn();

    await actions.searchContacts(dispatch)(taskId)(null, null);

    expect(dispatch).toBeCalledTimes(2);
    expect(dispatch).toBeCalledWith({ type: t.SEARCH_CONTACTS_REQUEST, taskId });
    expect(dispatch).toBeCalledWith({ type: t.SEARCH_CONTACTS_FAILURE, taskId, error });
  });
});