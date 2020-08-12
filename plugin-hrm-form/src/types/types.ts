/* eslint-disable import/no-unused-modules */

import { CallerFormValues } from '../components/common/forms/CallerForm';

export type CaseStatus = 'open' | 'close';

// This type is incomplete as we don't know the types for the remaining properties (perpetrators, etc)
export type CaseInfo = {
  summary?: string;
  notes?: string[];
  perpetrators?: { perpetrator: CallerFormValues; createdAt: string }[];
};

export type Case = {
  id: number;
  status: CaseStatus;
  helpline: string;
  twilioWorkerId: string;
  info?: CaseInfo;
  createdAt: string;
  updatedAt: string;
};