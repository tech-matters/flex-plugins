import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { SectionDescriptionText, SectionValueText } from '../../../Styles/search';

/**
 * @param {string | number | boolean} value The value for a particular SectionEntry
 */
const resolveValue = value => {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return '-';
};

const SectionEntry = ({ description, value }) => {
  return (
    <Grid container style={{ marginTop: 8, marginBottom: 8 }}>
      <Grid item xs={6}>
        <SectionDescriptionText>{description}</SectionDescriptionText>
      </Grid>
      <Grid item xs={6}>
        <SectionValueText>{resolveValue(value)}</SectionValueText>
      </Grid>
    </Grid>
  );
};

SectionEntry.displayName = 'SectionEntry';

SectionEntry.propTypes = {
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
};

export default SectionEntry;