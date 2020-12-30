/* eslint-disable import/no-unused-modules */
import type { CallTypes } from '../states/DomainConstants';
import { CallerFormValues } from '../components/common/forms/CallerForm';

export type CaseStatus = 'open' | 'closed';

type EntryInfo = { createdAt: string; twilioWorkerId: string };

export type PerpetratorEntry = { perpetrator: CallerFormValues } & EntryInfo;

export type HouseholdEntry = { household: CallerFormValues } & EntryInfo;

export type ReferralEntry = {
  date: Date;
  referredTo: string;
  comments: string;
};

export type Incident = { [key: string]: string | boolean };

export type IncidentEntry = { incident: Incident } & EntryInfo;

export const blankReferral = {
  date: null,
  referredTo: null,
  comments: null,
};

export type CaseInfo = {
  definitionVersion?: string;
  summary?: string;
  notes?: string[];
  perpetrators?: PerpetratorEntry[];
  households?: HouseholdEntry[];
  referrals?: ReferralEntry[];
  incidents?: IncidentEntry[];
  followUpDate?: string;
};

export type Case = {
  id: number;
  status: CaseStatus;
  helpline: string;
  twilioWorkerId: string;
  info?: CaseInfo;
  createdAt: string;
  updatedAt: string;
  connectedContacts: any[]; // TODO: create contact type
};

type NestedInformation = { name: { firstName: string; lastName: string } };
export type InformationObject = NestedInformation & {
  [key: string]: string | boolean | NestedInformation[keyof NestedInformation]; // having NestedInformation[keyof NestedInformation] makes type looser here because of this https://github.com/microsoft/TypeScript/issues/17867. Possible/future solution https://github.com/microsoft/TypeScript/pull/29317
};

// Information about a single contact, as expected from DB (we might want to reuse this type in backend) - (is this a correct placement for this?)
export type ContactRawJson = {
  definitionVersion?: string;
  callType: CallTypes | '';
  childInformation: InformationObject;
  callerInformation: InformationObject;
  caseInformation: { categories: {} } & { [key: string]: string | boolean | {} }; // // having {} makes type looser here because of this https://github.com/microsoft/TypeScript/issues/17867. Possible/future solution https://github.com/microsoft/TypeScript/pull/29317
  contactlessTask: { [key: string]: string | boolean };
  metadata: {
    startMillis: number;
    endMillis: number;
    recreated: boolean;
  };
};

// Information about a single contact, as expected from search contacts endpoint (we might want to reuse this type in backend) - (is this a correct placement for this?)
export type SearchContact = {
  contactId: string;
  overview: {
    dateTime: string;
    name: string;
    customerNumber: string;
    callType: string;
    categories: {};
    counselor: string;
    notes: string;
    channel: string;
    conversationDuration: number;
  };
  details: ContactRawJson;
};

export type SearchContactResult = {
  count: number;
  contacts: SearchContact[];
};

export type SearchCaseResult = {
  count: number;
  cases: Case[];
};
