// eslint-disable-next-line no-unused-vars
import { Actions, ITask, TaskHelper, StateHelper } from '@twilio/flex-ui';

import { transferChatResolve } from '../services/ServerlessService';
import { transferStatuses, transferModes } from '../states/DomainConstants';
import { getConfig } from '../HrmFormPlugin';

/**
 * @param {ITask} task
 */
export const hasTransferStarted = task => Boolean(task.attributes.transferMeta);

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
 * @param {ITask} task
 */
export const hasTaskControl = task =>
  !hasTransferStarted(task) ||
  (isOriginalReservation(task) && isTransferRejected(task)) ||
  (!isOriginalReservation(task) && isTransferAccepted(task));

/**
 * Sets attributes.channelSid to a dummy value to start tracking the task in TransferredTaskJanitor
 * @param {ITask} task
 */
export const setDummyChannelSid = async task => {
  const updatedAttributes = {
    ...task.attributes,
    channelSid: 'CH00000000000000000000000000000000',
  };
  await task.setAttributes(updatedAttributes);
};

/**
 * Updates the state of the transfer and adds a dummy channelSid to start tracking the task in TransferredTaskJanitor
 * @param {string} newStatus
 * @returns {(task: ITask) => Promise<void>}
 */
export const updateTransferStatus = newStatus => async task => {
  const updatedAttributes = {
    ...task.attributes,
    transferMeta: {
      ...task.attributes.transferMeta,
      transferStatus: newStatus,
    },
    channelSid: 'CH00000000000000000000000000000000',
  };
  await task.setAttributes(updatedAttributes);
};

export const setTransferAccepted = updateTransferStatus(transferStatuses.accepted);

export const setTransferRejected = updateTransferStatus(transferStatuses.rejected);

/**
 * Saves transfer metadata into task attributes
 * @param {ITask} task
 * @param {string} mode
 * @param {string} documentName name to retrieve the form or null if there were no form to save
 */
export const setTransferMeta = async (task, mode, documentName) => {
  // Set transfer metadata
  const updatedAttributes = {
    ...task.attributes,
    transferMeta: {
      originalTask: task.taskSid,
      originalReservation: task.sid,
      originalCounselor: task.workerSid,
      transferStatus: mode === transferModes.warm ? transferStatuses.transferring : transferStatuses.accepted,
      formDocument: documentName,
      mode,
    },
  };

  await task.setAttributes(updatedAttributes);
};

/**
 * Completes the first task and keeps the second as the valid, making sure the channel is kept open
 * @param {string} closeSid task to close
 * @param {string} keepSid task to keep
 * @param {string} memberToKick sid of the member that must be removed from channel
 * @param {string} newStatus resolution of the transfer (either "accepted" or "rejected")
 * @returns {Promise<void>}
 */
export const resolveTransferChat = async (closeSid, keepSid, memberToKick, newStatus) => {
  const body = { closeSid, keepSid, memberToKick, newStatus };

  try {
    await transferChatResolve(body);
  } catch (err) {
    console.log(`Error while closing task ${closeSid}`, err);
    window.alert('Error while closing task');
  }
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
    shouldReplaceChar(char)
      ? `_${char
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()}`
      : char,
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
 * Kicks the other participant in chat and then closes the original task
 * @param {ITask} task
 */
export const closeChatOriginal = async task => {
  const closeSid = task.attributes.transferMeta.originalTask;
  const keepSid = task.taskSid;
  const memberToKick = getMemberToKick(task, task.attributes.ignoreAgent);
  await resolveTransferChat(closeSid, keepSid, memberToKick, transferStatuses.accepted);
};

/**
 * Leaves the current chat and closes the task being transfered to the new counselor
 * @param {ITask} task
 */
export const closeChatSelf = async task => {
  const closeSid = task.taskSid;
  const keepSid = task.attributes.transferMeta.originalTask;
  const { identity } = getConfig();
  const memberToKick = getMemberToKick(task, identity);

  await resolveTransferChat(closeSid, keepSid, memberToKick, transferStatuses.rejected);
};

/**
 * Kicks the other participant in call and then closes the original task
 * @param {ITask} task
 * @returns {Promise<void>}
 */
export const closeCallOriginal = async task => {
  await setTransferAccepted(task);
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
  await Actions.invokeAction('HangupCall', { sid: task.sid });
};

/**
 * Following helpers are used by TransferredTaskJanitor, as it will check for reservations instead of tasks, in order to unify the behavior of chat and call based tasks.
 */

export const shouldCloseOriginalReservation = reservation =>
  reservation.reservation_sid === reservation.attributes.transferMeta.originalReservation &&
  reservation.attributes.transferMeta.transferStatus === transferStatuses.accepted;

export const shouldCloseTransferredReservation = reservation =>
  reservation.reservation_sid !== reservation.attributes.transferMeta.originalReservation &&
  reservation.attributes.transferMeta.transferStatus === transferStatuses.rejected;

export const shouldCloseReservation = reservation =>
  shouldCloseOriginalReservation(reservation) || shouldCloseTransferredReservation(reservation);

export const shouldInvokeCompleteTask = (reservation, workerSid) =>
  shouldCloseReservation(reservation) && reservation.status === 'wrapup' && reservation.worker_sid === workerSid;
