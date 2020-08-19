import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Collapse } from '@material-ui/core';
import { ArrowDropDownTwoTone, ArrowDropUpTwoTone } from '@material-ui/icons';

import { SectionTitleContainer, SectionTitleText, ContactDetailsIcon } from '../styles/search';

const ArrowDownIcon = ContactDetailsIcon(ArrowDropDownTwoTone);
const ArrowUpIcon = ContactDetailsIcon(ArrowDropUpTwoTone);

const Section = ({ color, sectionTitle, expanded, children, handleExpandClick, buttonDataTestid }) => (
  <>
    <SectionTitleContainer color={color}>
      <ButtonBase style={{ width: '100%', padding: 0 }} onClick={handleExpandClick} data-testid={buttonDataTestid}>
        <SectionTitleText>{sectionTitle.toUpperCase()}</SectionTitleText>
        {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </ButtonBase>
    </SectionTitleContainer>
    <Collapse in={expanded} timeout="auto">
      {children}
    </Collapse>
  </>
);

Section.displayName = 'Section';
Section.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  handleExpandClick: PropTypes.func.isRequired,
  buttonDataTestid: PropTypes.string,
};
Section.defaultProps = {
  expanded: false,
  color: null,
  buttonDataTestid: null,
};

export default Section;
