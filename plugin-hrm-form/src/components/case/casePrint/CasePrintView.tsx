/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-max-depth */
import React, { useState, useEffect } from 'react';
import { Page, Document, View, PDFViewer } from '@react-pdf/renderer';
import { Template } from '@twilio/flex-ui';
import { ButtonBase, CircularProgress } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { getConfig } from '../../../HrmFormPlugin';
import CasePrintSection from './CasePrintSection';
import CasePrintSummary from './CasePrintSummary';
import styles from './styles';
import { CasePrintViewContainer, HiddenText } from '../../../styles/HrmStyles';
import CasePrintDetails from './CasePrintDetails';
import type { CaseDetails } from '../../../states/case/types';
import CasePrintMultiSection from './CasePrintMultiSection';
import CasePrintNotes from './CasePrintNotes';
import CasePrintHeader from './CasePrintHeader';
import CasePrintFooter from './CasePrintFooter';
import {
  callerInfoSection,
  childInfoSection,
  contactSection,
  householdMultiSection,
  perpetratorMultiSection,
  incidentSection,
  referralsSection,
  notesSection,
  summary,
  caseManager,
  officeName,
} from './mockedData';
import { getImageAsString, ImageSource } from './helpers';

type OwnProps = {
  onClickClose: () => void;
  caseDetails: CaseDetails;
};
type Props = OwnProps;

const CasePrintView: React.FC<Props> = ({ onClickClose, caseDetails }) => {
  const { pdfImagesSource } = getConfig();

  const logoSource = `${pdfImagesSource}/helpline-logo.png`;
  const chkOnSource = `${pdfImagesSource}/chk_1.png`;
  const chkOffSource = `${pdfImagesSource}/chk_0.png`;

  const [loading, setLoading] = useState<boolean>(true);
  const [logoBlob, setLogoBlob] = useState<string>(null);
  const [chkOnBlob, setChkOnBlob] = useState<string>(null);
  const [chkOffBlob, setChkOffBlob] = useState<string>(null);

  /*
   * The purpose of this effect is to load all the images at once, to avoid re-renders in PDFViewer that leads to issues
   * https://stackoverflow.com/questions/60614940/unhandled-rejection-typeerror-nbind-externallistnum-dereference-is-not-a-f
   */
  useEffect(() => {
    const imageSources: ImageSource[] = [
      {
        url: logoSource,
        setStateCallback: setLogoBlob,
      },
      {
        url: chkOnSource,
        setStateCallback: setChkOnBlob,
      },
      {
        url: chkOffSource,
        setStateCallback: setChkOffBlob,
      },
    ];

    /**
     * Loads the collection of image BLOBs in memory (using setState callbacks)
     * @param imgSources ImageSources (url and callbacks)
     */
    async function loadImagesInMemory(imgSources: ImageSource[]) {
      const getImageBlob = async (imgSrc: ImageSource) => {
        const blob = await getImageAsString(imgSrc.url);
        imgSrc.setStateCallback(blob);
      };

      // Awaits until all promises are resolved (all images were loaded)
      await Promise.all(imgSources.map(src => getImageBlob(src)));
      setLoading(false);
    }

    loadImagesInMemory(imageSources);
  }, [logoSource, chkOnSource, chkOffSource]);

  return (
    <CasePrintViewContainer>
      <ButtonBase onClick={onClickClose} style={{ marginLeft: 'auto' }} data-testid="CasePrint-CloseCross">
        <HiddenText>
          <Template code="Case-CloseButton" />
        </HiddenText>
        <Close />
      </ButtonBase>
      {loading ? (
        <CircularProgress size={50} />
      ) : (
        <PDFViewer style={{ height: '100%' }}>
          <Document>
            <Page size="A4" style={styles.page}>
              <CasePrintHeader
                id={caseDetails.id}
                firstName={caseDetails.name.firstName}
                lastName={caseDetails.name.lastName}
                officeName={officeName}
                logoBlob={logoBlob}
              />
              <View>
                <CasePrintDetails
                  status={caseDetails.status}
                  openedDate={caseDetails.openedDate}
                  lastUpdatedDate={caseDetails.lastUpdatedDate}
                  followUpDate={caseDetails.followUpDate}
                  childIsAtRisk={caseDetails.childIsAtRisk}
                  counselor={caseDetails.caseCounselor}
                  caseManager={caseManager}
                  chkOnBlob={chkOnBlob}
                  chkOffBlob={chkOffBlob}
                />
                <CasePrintSection {...callerInfoSection} />
                <CasePrintSection {...childInfoSection} />
                <CasePrintSection {...contactSection} />
                <CasePrintMultiSection {...householdMultiSection} />
                <CasePrintMultiSection {...perpetratorMultiSection} />
                <CasePrintSection {...incidentSection} />
                <CasePrintSection {...referralsSection} />
                <CasePrintNotes {...notesSection} />
                <CasePrintSummary summary={summary} />
              </View>
              <CasePrintFooter />
            </Page>
          </Document>
        </PDFViewer>
      )}
    </CasePrintViewContainer>
  );
};

CasePrintView.displayName = 'CasePrintView';

export default CasePrintView;
