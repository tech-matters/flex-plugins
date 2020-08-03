import { reduce } from '../../../states/case/reducer';
import * as types from '../../../states/case/types';
import * as actions from '../../../states/case/actions';
import { Case } from '../../../types/types';

const task = { taskSid: 'task1' };

describe('test reducer', () => {
  let state = undefined;

  test('should return initial state', async () => {
    const expected = { tasks: {} };

    const result = reduce(state, {});
    expect(result).toStrictEqual(expected);

    state = result;
  });

  test('should handle SET_CONNECTED_CASE', async () => {
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

    const expected = { tasks: { task1: { connectedCase, temporaryCaseInfo: '' } } };

    const result = reduce(state, actions.setConnectedCase(connectedCase, task.taskSid));
    expect(result).toStrictEqual(expected);

    state = result;
  });

  test('should handle REMOVE_CONNECTED_CASE', async () => {
    const expected = { tasks: {} };

    const result = reduce(state, actions.removeConnectedCase(task.taskSid));
    expect(result).toStrictEqual(expected);

    // state = result; no assignment here as we don't want to lose the only task in the state, it will be reused in following tests
  });

  test('should handle UPDATE_CASE_INFO', async () => {
    const info = { summary: 'Some summary', notes: [{ note: 'Some note', createdAt: '2020-07-31T20:39:37.408Z' }] };

    const { connectedCase, temporaryCaseInfo } = state.tasks.task1;
    const expected = { tasks: { task1: { connectedCase: { ...connectedCase, info }, temporaryCaseInfo } } };

    const result = reduce(state, actions.updateCaseInfo(info, task.taskSid));
    expect(result).toStrictEqual(expected);

    state = result;
  });

  test('should handle UPDATE_TEMP_INFO', async () => {
    const string = 'Some random string here';

    const { connectedCase } = state.tasks.task1;
    const expected = { tasks: { task1: { connectedCase, temporaryCaseInfo: string } } };

    const result = reduce(state, actions.updateTempInfo(string, task.taskSid));
    expect(result).toStrictEqual(expected);

    state = result;
  });
});
