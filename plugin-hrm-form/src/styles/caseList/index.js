import React from 'react';
import styled from 'react-emotion';
import { TableCell, TableRow, withStyles } from '@material-ui/core';

import { Absolute, FontOpenSans } from '../HrmStyles';

export const TableContainer = styled('div')`
  border-left: 15px solid ${props => props.theme.colors.base2};
  border-right: 10px solid ${props => props.theme.colors.base2};
`;

export const CaseListContainer = styled(Absolute)`
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.base2};
`;

export const CaseListRowContainer = styled('div')`
  border-bottom: 5px solid ${props => props.theme.colors.base2};
`;

export const CaseListTableCell = withStyles(theme => ({
  root: {
    borderBottom: 0,
    textTransform: 'none',
  },
  // head: {},
  body: {
    height: 85,
    verticalAlign: 'top',
    paddingTop: 12,
  },
}))(TableCell);

/*
 * const CaseListTableCell = styled(TableCell)`
 *   border-bottom: 0px !important;
 *   text-transform: none !important;
 * `;
 */

export const CaseListTableRow = styled(TableRow)`
  background: #ffffff;
  border: 1px solid rgba(127, 134, 155, 0.07);
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
`;

export const TableHeaderFont = styled(FontOpenSans)`
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 1px;
`;

export const TableBodyActiveFont = styled(FontOpenSans)`
  color: #192b33;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
`;