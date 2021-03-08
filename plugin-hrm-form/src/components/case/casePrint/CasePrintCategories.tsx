/* eslint-disable react/prop-types */
import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import { getConfig } from '../../../HrmFormPlugin';
import styles from './styles';
import CaseTags from '../CaseTags';

type OwnProps = {
  categories?: {
    [category: string]: {
      [subcategory: string]: boolean;
    };
  };
  definitionVersion: string;
};

type Props = OwnProps;

const CasePrintCategories: React.FC<Props> = ({ categories, definitionVersion }) => {
  const { strings } = getConfig();

  return (
    <View style={styles.flexColumn}>
      <Text style={{ marginBottom: '10px' }}>{strings['TabbedForms-CategoriesTab']}</Text>
      <CaseTags printPDF={true} categories={categories} definitionVersion={definitionVersion} />
    </View>
  );
};

CasePrintCategories.displayName = 'CasePrintCategories';

export default CasePrintCategories;