import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import SyncClient from 'twilio-sync';

import './styles/GlobalOverrides';
import { SetupObject } from './utils/types';
import reducers, { namespace } from './states';
import HrmTheme from './styles/HrmTheme';
import { transferModes } from './states/DomainConstants';
import { initLocalization } from './utils/pluginHelpers';
import * as ActionFunctions from './utils/setUpActions';
import * as Components from './utils/setUpComponents';
import * as TransferHelpers from './utils/transfer';
import { changeLanguage } from './states/ConfigurationState';
import { issueSyncToken } from './services/ServerlessService';

const PLUGIN_NAME = 'HrmFormPlugin';
const PLUGIN_VERSION = '0.5.0';
export const DEFAULT_TRANSFER_MODE = transferModes.cold;

/**
 * Sync Client used to store and share documents across counselors
 */
let sharedStateClient: SyncClient;

export const getConfig = () => {
  const manager = Flex.Manager.getInstance();

  const hrmBaseUrl = manager.serviceConfiguration.attributes.hrm_base_url;
  const serverlessBaseUrl = manager.serviceConfiguration.attributes.serverless_base_url;
  const workerSid = manager.workerClient.sid;
  const { helpline, counselorLanguage, helplineLanguage } = manager.workerClient.attributes;
  const currentWorkspace = manager.serviceConfiguration.taskrouter_workspace_sid;
  const { identity, token } = manager.user;
  const { configuredLanguage } = manager.serviceConfiguration.attributes;
  const featureFlags = manager.serviceConfiguration.attributes.feature_flags || {};
  const { strings } = manager;

  return {
    hrmBaseUrl,
    serverlessBaseUrl,
    workerSid,
    helpline,
    currentWorkspace,
    counselorLanguage,
    helplineLanguage,
    configuredLanguage,
    identity,
    token,
    featureFlags,
    sharedStateClient,
    strings,
  };
};

const setUpSharedStateClient = () => {
  const updateSharedStateToken = async () => {
    try {
      const syncToken = await issueSyncToken();
      await sharedStateClient.updateToken(syncToken);
    } catch (err) {
      console.log('SYNC TOKEN ERROR', err);
    }
  };

  // initializes sync client for shared state
  const initSharedStateClient = async () => {
    try {
      const syncToken = await issueSyncToken();
      sharedStateClient = new SyncClient(syncToken);
      sharedStateClient.on('tokenAboutToExpire', () => updateSharedStateToken());
    } catch (err) {
      console.log('SYNC CLIENT INIT ERROR', err);
    }
  };

  initSharedStateClient();
};

const setUpTransferredTaskJanitor = async (setupObject: SetupObject) => {
  const { workerSid } = setupObject;
  const query = 'data.attributes.channelSid == "CH00000000000000000000000000000000"';
  const reservationQuery = await Flex.Manager.getInstance().insightsClient.liveQuery('tr-reservation', query);
  reservationQuery.on('itemUpdated', args => {
    if (TransferHelpers.shouldInvokeCompleteTask(args.value, workerSid)) {
      Flex.Actions.invokeAction('CompleteTask', { sid: args.value.reservation_sid });
    }
  });
};

const setUpTransfers = (setupObject: SetupObject) => {
  setUpSharedStateClient();
  setUpTransferredTaskJanitor(setupObject);
};

const setUpLocalization = (config: ReturnType<typeof getConfig>) => {
  const manager = Flex.Manager.getInstance();

  const { counselorLanguage, helplineLanguage, configuredLanguage } = config;

  const twilioStrings = { ...manager.strings }; // save the originals
  const setNewStrings = newStrings => (manager.strings = { ...manager.strings, ...newStrings });
  const afterNewStrings = language => {
    manager.store.dispatch(changeLanguage(language));
    Flex.Actions.invokeAction('NavigateToView', { viewName: manager.store.getState().flex.view.activeView }); // force a re-render
  };
  const localizationConfig = { twilioStrings, setNewStrings, afterNewStrings };
  const initialLanguage = counselorLanguage || helplineLanguage || configuredLanguage;

  return initLocalization(localizationConfig, initialLanguage);
};

const setUpComponents = (setupObject: SetupObject) => {
  const { helpline, featureFlags } = setupObject;

  // setUp (add) dynamic components
  Components.setUpQueuesStatusWriter(setupObject);
  Components.setUpQueuesStatus();
  Components.setUpCustomCRMContainer();
  if (featureFlags.enable_transfers) Components.setUpTransferComponents();

  if (!Boolean(helpline)) Components.setUpDeveloperComponents(setupObject); // utilities for developers only

  // remove dynamic components
  Components.removeActionsIfWrapping();
  Components.removeLogo();
  Components.removeDirectoryButton();
  Components.removeActionsIfTransferring();
};

const setUpActions = (setupObject: SetupObject) => {
  const { featureFlags } = setupObject;

  // bind setupObject to the functions that requires some initializaton
  const transferOverride = ActionFunctions.customTransferTask(setupObject);
  const wrapupOverride = ActionFunctions.wrapupTask(setupObject);
  const beforeCompleteAction = ActionFunctions.sendFormToBackend(setupObject);

  Flex.Actions.addListener('beforeAcceptTask', ActionFunctions.initializeContactForm);

  if (featureFlags.enable_transfers) Flex.Actions.addListener('afterAcceptTask', ActionFunctions.restoreFormIfTransfer);

  if (featureFlags.enable_transfers) Flex.Actions.replaceAction('TransferTask', transferOverride);

  Flex.Actions.replaceAction('HangupCall', ActionFunctions.hangupCall);

  Flex.Actions.replaceAction('WrapupTask', wrapupOverride);

  Flex.Actions.addListener('beforeCompleteTask', beforeCompleteAction);

  Flex.Actions.addListener('afterCompleteTask', ActionFunctions.removeContactForm);
};

export default class HrmFormPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    console.log(`Welcome to ${PLUGIN_NAME} Version ${PLUGIN_VERSION}`);
    this.registerReducers(manager);

    const config = getConfig();

    /*
     * localization setup (translates the UI if necessary)
     * WARNING: the way this is done right now is "hacky". More info in initLocalization declaration
     */
    const { translateUI, getGoodbyeMsg } = setUpLocalization(config);

    const setupObject = { ...config, translateUI, getGoodbyeMsg };

    if (config.featureFlags.enable_transfers) setUpTransfers(setupObject);
    setUpComponents(setupObject);
    setUpActions(setupObject);

    const managerConfiguration = {
      colorTheme: HrmTheme,
    };
    manager.updateConfig(managerConfiguration);

    // TODO(nick): Eventually remove this log line or set to debug.  Should we fail hard here?
    const { hrmBaseUrl } = config;
    console.log(`HRM URL: ${hrmBaseUrl}`);
    if (hrmBaseUrl === undefined) {
      console.error('HRM base URL not defined, you must provide this to save program data');
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param {import('@twilio/flex-ui').Manager} manager
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
