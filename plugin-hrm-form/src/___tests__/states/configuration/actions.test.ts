import * as types from '../../../states/configuration/types';
import * as actions from '../../../states/configuration/actions';
import mockV1 from '../../../formDefinitions/v1';

describe('test action creators', () => {
  test('changeLanguage', async () => {
    const language = 'es';

    expect(actions.changeLanguage(language)).toStrictEqual({
      type: types.CHANGE_LANGUAGE,
      language,
    });
  });

  test('populateCounselorsState', async () => {
    const counselorsList: types.CounselorsList = [
      { sid: '1', fullName: '1' },
      { sid: '2', fullName: '2' },
      { sid: '3', fullName: '3' },
    ];

    expect(actions.populateCounselorsState(counselorsList)).toStrictEqual({
      type: types.POPULATE_COUNSELORS,
      counselorsList,
    });
  });

  test('chatCapacityUpdated', async () => {
    expect(actions.chatCapacityUpdated(2)).toStrictEqual({
      type: types.CHAT_CAPACITY_UPDATED,
      capacity: 2,
    });
  });

  test('populateCurrentDefinitionVersion', async () => {
    expect(actions.populateCurrentDefinitionVersion(mockV1)).toStrictEqual({
      type: types.POPULATE_CURRENT_DEFINITION_VERSION,
      definitions: mockV1,
    });
  });

  test('updateFormsVersion', async () => {
    expect(actions.updateFormsVersion('v1', mockV1)).toStrictEqual({
      type: types.UPDATE_FORMS_VERSION,
      version: 'v1',
      definitions: mockV1,
    });
  });
});
