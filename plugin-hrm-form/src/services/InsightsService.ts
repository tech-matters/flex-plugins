/* eslint-disable camelcase */
import { ITask } from '@twilio/flex-ui';
import cloneDeep from 'lodash/cloneDeep';

import { isNonDataCallType } from '../states/ValidationRules';
import { mapChannelForInsights } from '../utils/mappers';
import { getDateTime } from '../utils/helpers';
import { TaskEntry } from '../states/contacts/reducer';
import { Case } from '../types/types';
import { formatCategories } from '../utils/formatters';
import callTypes from '../states/DomainConstants';
import { zambiaInsightsConfig } from '../insightsConfig/zambia';
import { southAfricaV1InsightsConfig } from '../insightsConfig/za-v1';
import {
  InsightsObject,
  FieldType,
  InsightsFieldSpec,
  InsightsFormSpec,
  InsightsConfigSpec,
} from '../insightsConfig/types';

/*
 * 'Any' is the best we can do, since we're limited by Twilio here.
 * See https://assets.flex.twilio.com/releases/flex-ui/1.18.0/docs/ITask.html
 */
type TaskAttributes = any;

type InsightsAttributes = {
  conversations?: { [key: string]: string | number };
  customers?: { [key: string]: string | number };
};

const delimiter = ';';

/*
 * Converts an array of categories with a fully-specified path (as stored in Redux)
 * into an object where the top-level categories are the keys and the values
 * are an array of subcategories (as returned from our API).
 * Example:
 * makeCategoryMap(['categories.Cat1.SubcatA', 'categories.Cat1.SubcatB', 'categories.Cat3.SubcatE'])
 *  returns:
 *   {
 *     "Cat1": ["SubcatA", "SubcatB"],
 *     "Cat3": ["SubcatE"],
 *   }
 */
const makeCategoryMap = (categories: string[]): { [category: string]: string[] } => {
  return categories.reduce((acc, fullPathCategory) => {
    const [, cat, subcat] = fullPathCategory.split('.');
    acc[cat] = acc[cat] || [];
    acc[cat].push(subcat);
    return acc;
  }, {});
};

const getSubcategories = (contactForm: TaskEntry): string => {
  if (!contactForm || !contactForm.categories) return '';

  const { categories } = contactForm;

  const categoryMap = makeCategoryMap(categories);
  return formatCategories(categoryMap).join(delimiter);
};

const baseUpdates = (taskAttributes: TaskAttributes, contactForm: TaskEntry, caseForm: Case): InsightsAttributes => {
  const { callType } = contactForm;
  const hasCustomerData = !isNonDataCallType(callType);

  const communication_channel = taskAttributes.isContactlessTask
    ? mapChannelForInsights(
        typeof contactForm.contactlessTask.channel === 'string'
          ? contactForm.contactlessTask.channel
          : contactForm.contactlessTask.channel.toString(),
      )
    : mapChannelForInsights(taskAttributes.channelType);

  // First add the data we add whether or not there's contact form data
  const coreAttributes: InsightsAttributes = {
    conversations: {
      conversation_attribute_2: callType.toString(),
      /*
       * By default, Twilio populates attribute 5 with the Task ID, but we
       * overwrite it for data contacts so we want it null for non-data contacts.
       * We'll set it to null in case this is a non-data contact,
       * and then let other updates overwrite again later for data contacts.
       */
      conversation_attribute_5: null,
      communication_channel,
    },
  };

  if (!hasCustomerData) {
    return coreAttributes;
  }
  return {
    conversations: {
      ...coreAttributes.conversations,
      conversation_attribute_1: getSubcategories(contactForm).toString(),
    },
  };
};

const contactlessTaskUpdates = (
  attributes: TaskAttributes,
  contactForm: TaskEntry,
  caseForm: Case,
): InsightsAttributes => {
  if (!attributes.isContactlessTask) {
    return {};
  }

  const dateTime = getDateTime(contactForm.contactlessTask);

  return {
    conversations: {
      date: dateTime,
    },
  };
};

const convertMixedCheckbox = (v: string | boolean): number => {
  if (v === true) {
    return 1;
  } else if (v === false) {
    return 0;
  } else if (v === 'mixed') {
    return null;
  }
  console.error(`Bad mixed checkbox value [${v}], defaulting to null for Insights value`);
  return null;
};

type InsightsCaseForm = {
  topLevel?: { [key: string]: string };
  perpetrator?: { [key: string]: string };
  incident?: { [key: string]: string | boolean };
  referral?: { [key: string]: string };
};

/*
 * This takes a Case and turns it into a format more like the subforms
 * for a TaskEntry (contact form) so it can be consumed in the same manner.
 * As of January 2, 2021, Case has not been moved over to use the
 * customization framework.  When it is, we will need to change this function.
 */
const convertCaseFormForInsights = (caseForm: Case): InsightsCaseForm => {
  if (!caseForm || Object.keys(caseForm).length === 0) return {};
  let topLevel: { [key: string]: string } = {};
  let perpetrator: { [key: string]: string } = undefined;
  let incident: { [key: string]: string | boolean } = undefined;
  let referral: { [key: string]: string } = undefined;
  topLevel = {
    id: caseForm.id.toString(),
  };
  if (caseForm.info?.perpetrators && caseForm.info.perpetrators.length > 0) {
    /*
     * Flatten out the Perpetrator object. This can be changed after this is using the
     * customization framework.
     */
    const thePerp = caseForm.info.perpetrators[0];
    const untypedPerp: any = {
      ...thePerp,
      ...thePerp.perpetrator,
    };
    delete untypedPerp.perpetrator;
    delete untypedPerp.name;
    delete untypedPerp.location;
    perpetrator = {
      ...untypedPerp,
    };
  }
  if (caseForm.info?.incidents && caseForm.info.incidents.length > 0) {
    const theIncident = caseForm.info.incidents[0];
    const untypedIncident: any = {
      ...theIncident,
      ...theIncident.incident,
    };
    delete untypedIncident.incident;
    incident = {
      ...untypedIncident,
    };
  }
  if (caseForm.info?.referrals && caseForm.info.referrals.length > 0) {
    referral = {
      ...caseForm.info.referrals[0],
      date: caseForm.info.referrals[0].date.toString(),
    };
  }
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const newCaseForm: InsightsCaseForm = {
    topLevel,
    perpetrator,
    incident,
    referral,
  };

  return newCaseForm;
};

export const processHelplineConfig = (
  contactForm: TaskEntry,
  caseForm: Case,
  configSpec: InsightsConfigSpec,
): InsightsAttributes => {
  const insightsAtts: InsightsAttributes = {
    customers: {},
    conversations: {},
  };

  const formsToProcess: [InsightsFormSpec, TaskEntry | InsightsCaseForm][] = [];
  if (configSpec.contactForm) {
    // Clone the whole object to avoid modifying the real spec. May not be needed.
    const contactSpec = cloneDeep(configSpec.contactForm);
    if (contactForm.callType !== callTypes.caller) {
      // If this isn't a caller type, don't save the caller form data
      contactSpec.callerInformation = [];
    }
    formsToProcess.push([contactSpec, contactForm]);
  }
  if (configSpec.caseForm) {
    formsToProcess.push([configSpec.caseForm, convertCaseFormForInsights(caseForm)]);
  }
  formsToProcess.forEach(([spec, form]) => {
    Object.keys(spec).forEach(subform => {
      const fields: InsightsFieldSpec[] = spec[subform];
      fields.forEach(field => {
        const [insightsObject, insightsField] = field.insights;
        let value = form[subform] && form[subform][field.name];
        if (field.type === FieldType.MixedCheckbox) {
          value = convertMixedCheckbox(value);
        }
        insightsAtts[insightsObject][insightsField] = value;
      });
    });
  });

  return insightsAtts;
};

// Visible for testing
export const zambiaUpdates = (
  attributes: TaskAttributes,
  contactForm: TaskEntry,
  caseForm: Case,
): InsightsAttributes => {
  const { callType } = contactForm;
  if (isNonDataCallType(callType)) return {};

  const attsToReturn: InsightsAttributes = processHelplineConfig(contactForm, caseForm, zambiaInsightsConfig);

  /*
   * Custom additions:
   *  Add province and district into area
   */
  attsToReturn[InsightsObject.Customers].area = [
    contactForm.childInformation.province,
    contactForm.childInformation.district,
  ].join(delimiter);

  return attsToReturn;
};

export const southAfricaUpdates = (
  attributes: TaskAttributes,
  contactForm: TaskEntry,
  caseForm: Case,
): InsightsAttributes => {
  const { callType } = contactForm;
  if (isNonDataCallType(callType)) return {};

  const attsToReturn: InsightsAttributes = processHelplineConfig(contactForm, caseForm, southAfricaV1InsightsConfig);

  /*
   * Custom additions:
   *  Add province, municipality district into area
   */
  attsToReturn[InsightsObject.Customers].area = [
    contactForm.childInformation.province,
    contactForm.childInformation.municipality,
    contactForm.childInformation.district,
  ].join(delimiter);

  return attsToReturn;
};

const mergeAttributes = (previousAttributes: TaskAttributes, newAttributes: InsightsAttributes): TaskAttributes => {
  return {
    ...previousAttributes,
    conversations: {
      ...previousAttributes.conversations,
      ...newAttributes.conversations,
    },
    customers: {
      ...previousAttributes.customers,
      ...newAttributes.customers,
    },
  };
};

// In TS, how do we say that we are returning a function?
const getInsightsUpdateFunctionsForConfig = (config: any): any => {
  const functionArray = [baseUpdates, contactlessTaskUpdates];
  if (config.useZambiaInsights) {
    functionArray.push(zambiaUpdates);
  }
  if (config.useSouthAfricaInsights) {
    functionArray.push(southAfricaUpdates);
  }
  return functionArray;
};

/*
 * The idea here is to apply a cascading series of modifications to the attributes for Insights.
 * We may have a set of core values to add, plus conditional core values (such as if this is a
 * contactless task), and then may have helpline-specific updates based on configuration.
 *
 * Note: config parameter tells where to go to get helpline-specific tests.  It should
 * eventually match up with getConfig().  Also useful for testing.
 */
export async function saveInsightsData(twilioTask: ITask, contactForm: TaskEntry, caseForm: Case, config = {}) {
  const previousAttributes: TaskAttributes = twilioTask.attributes;
  const finalAttributes: TaskAttributes = getInsightsUpdateFunctionsForConfig(config)
    .map((f: any) => f(twilioTask.attributes, contactForm, caseForm))
    .reduce((acc: TaskAttributes, curr: InsightsAttributes) => mergeAttributes(acc, curr), previousAttributes);

  await twilioTask.setAttributes(finalAttributes);
}
