import React from 'react';
import styled, { keyframes } from 'react-emotion';
import { Input, Select, MenuItem, TableCell, Tabs, Tab } from '@material-ui/core';
import { Button, getBackgroundWithHoverCSS } from '@twilio/flex-ui';

export const Absolute = styled('div')`
  position: absolute;
  top: ${({ top }) => top || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
`;

export const TabbedFormsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const containerLeftRightMargin = '20px';
export const Container = styled('div')`
  display: flex;
  padding: 32px 20px 12px 20px;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: #ffffff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin: 0 ${containerLeftRightMargin};
  height: 100%;
  overflow-y: auto;
`;

export const ErrorText = styled('p')`
  color: ${props => props.theme.colors.errorColor};
  font-size: 10px;
  line-height: 1.5;
`;

export const StyledInput = styled(Input)`
  display: flex;
  flex-grow: 0;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: normal;
  input {
    width: 217px;
    height: 36px;
    border-radius: 4px;
    background-color: rgba(236, 237, 241, 0.37);
    border: none;
  }
  input[type='date'] {
    padding-right: 7px;
  }
  input[type='date']::-webkit-clear-button,
  input[type='date']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }
  input:focus {
    background-color: rgba(236, 237, 241, 0.37);
    box-shadow: none;
    border: 1px solid rgba(0, 59, 129, 0.37);
  }
  background-color: ${props => props.theme.colors.base1};
  color: ${props =>
    props.theme.calculated.lightTheme ? props.theme.colors.darkTextColor : props.theme.colors.lightTextColor};
`;

export const TextField = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;

export const StyledLabel = styled('label')`
  text-transform: uppercase;
  margin-bottom: 8px;
  font-size: 13px;
  letter-spacing: 2px;
  min-height: 18px;
`;

export const StyledSelect = styled(Select)`
  flex-grow: 0;
  flex-shrink: 0;
  width: 217px;
  div[role='button'] {
    height: 36px;
    line-height: 22px;
    border-radius: 4px;
    background-color: rgba(236, 237, 241, 0.37);
    border: none;
    color: ${({ isPlaceholder }) => (isPlaceholder ? 'darkgray' : 'currentColor')};
  }
  .Twilio-Dropdown {
    height: 100%;
  }
  [class*='MuiSelect-selectMenu'] {
    padding-top: 7px;
    padding-bottom: 7px;
    border-right-width: 0px;
    &:focus {
      border-right-width: 1px;
    }
  }
  background-color: ${props => props.theme.colors.base1};
  color: ${props =>
    props.theme.calculated.lightTheme ? props.theme.colors.darkTextColor : props.theme.colors.lightTextColor};
`;

export const StyledMenuItem = styled(MenuItem)`
  box-sizing: border-box;
  height: 32px;
  display: flex;
  margin: 0;
  padding: 0 12px;
  min-width: 0;
`;

export const StyledButton = styled(Button)`
    color: white;
    text-transform: uppercase;
    margin-bottom: 15px;
    width: 320px;
    height: 48px;
    border: ${props => (props.selected ? '2px solid #000000;' : 'none')}
    background-color: ${props => (props.disabled ? props.theme.colors.base5 : props.theme.colors.defaultButtonColor)};
    ${p =>
      getBackgroundWithHoverCSS(
        p.disabled ? p.theme.colors.base5 : p.theme.colors.defaultButtonColor,
        true,
        false,
        p.disabled,
      )};
`;

export const StyledNextStepButton = styled(Button)`
  color: white;
  text-transform: uppercase;
  width: 200px;
  background-color: ${props => (props.disabled ? props.theme.colors.base5 : props.theme.colors.defaultButtonColor)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'default')};
  ${p =>
    getBackgroundWithHoverCSS(
      p.disabled ? p.theme.colors.base5 : p.theme.colors.defaultButtonColor,
      true,
      false,
      p.disabled,
    )};
`;

const shadowPulse = keyframes`
    0% {
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
        box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
    }
`;

export const StyledFinishButton = styled(Button)`
    animation: ${shadowPulse} 1s infinite;
    color: white;
    text-transform: uppercase;
    margin-bottom: 15px;
    width: 320px;
    height: 48px;
    border: ${props => (props.selected ? '2px solid #000000;' : 'none')}
    background-color: ${props => (props.disabled ? props.theme.colors.base5 : props.theme.colors.defaultButtonColor)};
    ${p =>
      getBackgroundWithHoverCSS(
        p.disabled ? p.theme.colors.base5 : p.theme.colors.defaultButtonColor,
        true,
        false,
        p.disabled,
      )};
`;

export const TransparentButton = styled(Button)`
  color: black;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px;
`;

export const CheckboxField = styled('div')`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
`;

export const StyledCheckboxLabel = styled('label')`
  text-transform: uppercase;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 12px;
  letter-spacing: normal;
`;

export const TopNav = styled('div')`
  display: flex;
  flex-direction: row;
`;

export const BottomButtonBar = styled('div')`
  margin: 0 ${containerLeftRightMargin};
  height: 55px;
  flex-shrink: 0;
  background: red;
`;

export const NameFields = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > div {
    flex-grow: 1;
    flex-basis: 0;
    margin: 0 10px;
  }
`;

export const ColumnarBlock = styled('div')`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  margin: 0 10px;
`;

export const TwoColumnLayout = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CategoryCheckboxField = styled('div')`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  width: 160px;
`;

export const StyledTableCell = styled(TableCell)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const StyledSearchButton = styled(StyledNextStepButton)`
  width: 100px;
  margin-bottom: 8px;
  margin-top: auto;
`;

export const StyledTabs = styled(props => <Tabs {...props} classes={{ indicator: 'indicator' }} />)`
  && .indicator {
    background-color: transparent;
  }
  flex-shrink: 0;
`;

export const StyledTab = styled(props => <Tab {...props} classes={{ selected: 'selected' }} />)`
  && {
    min-width: ${({ searchTab }) => (searchTab ? '50px' : '130px')};
    width: ${({ searchTab }) => (searchTab ? '50px' : '130px')};
    background-color: ${({ searchTab }) => (searchTab ? 'transparent' : '#d1d1d5')};
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin: 0 5px;
    line-height: 18px;

    &.selected {
      background-color: #ffffff;
    }
  }
`;

export const Row = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FontOpenSans = styled('p')`
  color: #000000;
  font-family: Open Sans;
  text-align: left;
`;
