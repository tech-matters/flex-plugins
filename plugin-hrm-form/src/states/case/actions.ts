import { Case, CaseInfo } from '../../types/types';
import {
  CaseActionType,
  TemporaryCaseInfo,
<<<<<<< HEAD
  ViewNoteInfo,
=======
>>>>>>> Perpetrators changes
  SET_CONNECTED_CASE,
  REMOVE_CONNECTED_CASE,
  UPDATE_CASE_INFO,
  UPDATE_TEMP_INFO,
<<<<<<< HEAD
  UPDATE_VIEW_NOTE_INFO,
=======
>>>>>>> Perpetrators changes
} from './types';

// Action creators
export const setConnectedCase = (connectedCase: Case, taskId: string): CaseActionType => ({
  type: SET_CONNECTED_CASE,
  connectedCase,
  taskId,
});

export const removeConnectedCase = (taskId: string): CaseActionType => ({
  type: REMOVE_CONNECTED_CASE,
  taskId,
});

export const updateCaseInfo = (info: CaseInfo, taskId: string): CaseActionType => ({
  type: UPDATE_CASE_INFO,
  info,
  taskId,
});

export const updateTempInfo = (value: TemporaryCaseInfo, taskId: string): CaseActionType => ({
  type: UPDATE_TEMP_INFO,
  value,
  taskId,
});

export const updateViewNoteInfo = (info: ViewNoteInfo, taskId: string): CaseActionType => ({
  type: UPDATE_VIEW_NOTE_INFO,
  info,
  taskId,
});
