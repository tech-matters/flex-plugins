import { Case, CaseInfo } from '../../../types/types';
import * as types from '../../../states/case/types';
import * as actions from '../../../states/case/actions';

const task = { taskSid: 'task1' };

describe('test action creators', () => {
  test('setConnectedCase', async () => {
    const connectedCase: Case = {
      id: 1,
      helpline: '',
      status: 'open',
      twilioWorkerId: 'WK123',
      info: null,
      createdAt: '2020-07-31T20:39:37.408Z',
      updatedAt: '2020-07-31T20:39:37.408Z',
    };

    const expectedAction: types.CaseActionType = {
      type: types.SET_CONNECTED_CASE,
      connectedCase,
      taskId: task.taskSid,
    };

    expect(actions.setConnectedCase(connectedCase, task.taskSid)).toStrictEqual(expectedAction);
  });

  test('removeConnectedCase', async () => {
    const expectedAction: types.CaseActionType = {
      type: types.REMOVE_CONNECTED_CASE,
      taskId: task.taskSid,
    };

    expect(actions.removeConnectedCase(task.taskSid)).toStrictEqual(expectedAction);
  });

  test('updateCaseInfo', async () => {
    const info = { summary: 'Some summary', notes: ['Some note'] };
    const expectedAction: types.CaseActionType = {
      type: types.UPDATE_CASE_INFO,
      info,
      taskId: task.taskSid,
    };

    expect(actions.updateCaseInfo(info, task.taskSid)).toStrictEqual(expectedAction);
  });

  test('updateTempInfo', async () => {
    const value = 'Some string here';
    const expectedAction: types.CaseActionType = {
      type: types.UPDATE_TEMP_INFO,
      value,
      taskId: task.taskSid,
    };

    expect(actions.updateTempInfo(value, task.taskSid)).toStrictEqual(expectedAction);
  });
});