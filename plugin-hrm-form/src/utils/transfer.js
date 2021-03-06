// eslint-disable-next-line no-unused-vars
import { Actions, ITask, TaskHelper, StateHelper } from '@twilio/flex-ui';

import { transferStatuses, transferModes } from '../states/DomainConstants';

/**
 * @param {ITask} task
 */
export const hasTransferStarted = task => Boolean(task.attributes && task.attributes.transferMeta);

/**
 * @param {ITask} task
 */
export const isOriginalReservation = task =>
  Boolean(task.attributes.transferMeta && task.attributes.transferMeta.originalReservation === task.sid);

/**
 * @param {ITask} task
 */
export const isWarmTransfer = task =>
  Boolean(task.attributes.transferMeta && task.attributes.transferMeta.mode === transferModes.warm);

/**
 * @param {ITask} task
 */
export const isColdTransfer = task =>
  Boolean(task.attributes.transferMeta && task.attributes.transferMeta.mode === transferModes.cold);

/**
 * @param {string} status
 * @returns {(task: ITask) => boolean}
 */
const isTaskInTransferStatus = status => task =>
  Boolean(task.attributes.transferMeta && task.attributes.transferMeta.transferStatus === status);

export const isTransferring = isTaskInTransferStatus(transferStatuses.transferring);

export const isTransferRejected = isTaskInTransferStatus(transferStatuses.rejected);

export const isTransferAccepted = isTaskInTransferStatus(transferStatuses.accepted);

/**
 * @param {ITask} task
 */
export const shouldShowTransferButton = task =>
  TaskHelper.isTaskAccepted(task) &&
  task.taskStatus === 'assigned' &&
  task.status === 'accepted' &&
  !isTransferring(task);

/**
 * @param {ITask} task
 */
export const shouldShowTransferControls = task =>
  !isOriginalReservation(task) && isTransferring(task) && TaskHelper.isTaskAccepted(task);

/**
 * Indicates if the current counselor has sole control over the task. Used to know if counselor should send form to hrm backend and prevent the form from being edited
 * A counselor controls a task if
 * - transfer was not initiated
 * - this is the original reservation and a transfer was initiated and then rejected
 * - this is not the original reservation and a transfer was initiated and then accepted
 * @param {import('../types/types').CustomITask} task
 */
export const hasTaskControl = task =>
  !hasTransferStarted(task) || task.attributes.transferMeta.sidWithTaskControl === task.sid;

/**
 * @param {ITask} task
 * @param {string} sidWithTaskControl
 */
const setTaskControl = async (task, sidWithTaskControl) => {
  const updatedAttributes = {
    ...task.attributes,
    transferMeta: {
      ...task.attributes.transferMeta,
      sidWithTaskControl,
    },
  };

  await task.setAttributes(updatedAttributes);
};

/**
 * Takes control of the given task
 * @param {ITask} task
 */
export const takeTaskControl = async task => {
  await setTaskControl(task, task.sid);
};

/**
 * Returns control of the given task to original counselor (only for call tasks for now)
 * @param {ITask} task
 */
export const returnTaskControl = async task => {
  if (TaskHelper.isCallTask(task)) {
    await setTaskControl(task, task.attributes.transferMeta.originalReservation);
  }
};

/**
 * Removes the control of the given task (only for call tasks for now)
 * @param {ITask} task
 */
export const clearTaskControl = async task => {
  if (TaskHelper.isCallTask(task)) {
    await setTaskControl(task, '');
  }
};

/**
 * Updates the state of the transfer and adds a dummy channelSid to start tracking the task in TransferredTaskJanitor
 * @param {string} newStatus
 * @returns {(task: ITask) => Promise<void>}
 */
export const updateTransferStatus = newStatus => async task => {
  const updatedAttributes = {
    ...task.attributes,
    transferStarted: true,
    transferMeta: {
      ...task.attributes.transferMeta,
      transferStatus: newStatus,
    },
  };
  await task.setAttributes(updatedAttributes);
};

export const setTransferAccepted = updateTransferStatus(transferStatuses.accepted);

export const setTransferRejected = updateTransferStatus(transferStatuses.rejected);

/**
 * Saves transfer metadata into task attributes
 * @param {{ task: ITask, options: { mode: string }, targetSid: string }} payload
 * @param {string} documentName name to retrieve the form or null if there were no form to save
 * @param {string} counselorName
 */
export const setTransferMeta = async (payload, documentName, counselorName) => {
  const { task, options, targetSid } = payload;
  const { mode } = options;
  const targetType = targetSid.startsWith('WK') ? 'worker' : 'queue';

  // Set transfer metadata
  const updatedAttributes = {
    ...task.attributes,
    transferStarted: true,
    transferMeta: {
      originalTask: task.taskSid,
      originalReservation: task.sid,
      originalCounselor: task.workerSid,
      originalCounselorName: counselorName,
      sidWithTaskControl: mode === transferModes.warm ? '' : 'WR00000000000000000000000000000000', // if cold, set control to dummy value so Task Janitor completes this one
      transferStatus: mode === transferModes.warm ? transferStatuses.transferring : transferStatuses.accepted,
      formDocument: documentName,
      mode,
      targetType,
    },
  };

  await task.setAttributes(updatedAttributes);
};

/**
 * @param {ITask} task
 */
export const clearTransferMeta = async task => {
  const { transferMeta, transferStarted, ...attributes } = task.attributes;

  await task.setAttributes(attributes);
};

const letterNumber = /^[0-9a-zA-Z]+$/;
/**
 * @param {string} char
 */
export const shouldReplaceChar = char => !char.match(letterNumber);

/**
 * Helper to match the transformation Twilio does on identity for the member resources
 * @param {string} str
 */
export const transformIdentity = str => {
  const transformed = [...str].map(char =>
    shouldReplaceChar(char) ? `_${char.charCodeAt(0).toString(16).toUpperCase()}` : char,
  );
  return transformed.join('');
};

/**
 * Takes the task and identity of the counselor to kick, and returns it's memberSid
 * @param {ITask} task
 * @param {string} kickIdentity
 */
export const getMemberToKick = (task, kickIdentity) => {
  const ChatChannel = StateHelper.getChatChannelStateForTask(task);
  const Member = ChatChannel.members.get(transformIdentity(kickIdentity));
  return (Member && Member.source && Member.source.sid) || '';
};

/**
 * Kicks the other participant in call and then closes the original task
 * @param {ITask} task
 * @returns {Promise<void>}
 */
export const closeCallOriginal = async task => {
  await setTransferAccepted(task);
  await takeTaskControl(task);
  await Actions.invokeAction('KickParticipant', {
    sid: task.sid,
    targetSid: task.attributes.transferMeta.originalCounselor,
  });
};

/**
 * Hangs the current call and closes the task being transfered to the new counselor (i.e. this task)
 * @param {ITask} task
 * @returns {Promise<void>}
 */
export const closeCallSelf = async task => {
  await setTransferRejected(task);
  await returnTaskControl(task);
  await Actions.invokeAction('HangupCall', { sid: task.sid });
};

/**
 * Following helpers are used by TransferredTaskJanitor, as it will check for reservations instead of tasks, in order to unify the behavior of chat and call based tasks.
 */

export const someoneHasTaskControl = reservation => reservation.attributes.transferMeta.sidWithTaskControl !== '';

export const reservationHasTaskControl = reservation =>
  reservation.attributes.transferMeta.sidWithTaskControl === reservation.reservation_sid;

export const taskControlledByOther = reservation =>
  someoneHasTaskControl(reservation) && !reservationHasTaskControl(reservation);

export const callerLeftWhileTransferring = reservation =>
  reservation.status === 'wrapup' && !someoneHasTaskControl(reservation);

export const callerLeftAndThisShouldClose = reservation =>
  callerLeftWhileTransferring(reservation) &&
  reservation.attributes.transferMeta.originalCounselor !== reservation.worker_sid;

export const shouldInvokeCompleteTask = (reservation, workerSid) =>
  reservation.status === 'wrapup' &&
  (taskControlledByOther(reservation) || callerLeftAndThisShouldClose(reservation)) &&
  reservation.worker_sid === workerSid;

export const transferAborted = reservation =>
  (reservation.status === 'rejected' || reservation.status === 'timeout') &&
  reservation.attributes.transferMeta.targetType === 'worker';

export const shouldTakeControlBack = (reservation, workerSid) =>
  (transferAborted(reservation) || callerLeftWhileTransferring(reservation)) &&
  reservation.attributes.transferMeta.originalCounselor === workerSid &&
  reservation.attributes.transferMeta.mode === transferModes.warm;
