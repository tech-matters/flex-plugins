const colors = {
  base1: '#ffffff',
  base2: '#f6f6f6',
  buttonTextColor: '#ffffff',
  secondaryButtonTextColor: '#192b33',
  disabledColor: '#d8d8d8',
  defaultButtonColor: '#192b33',
  secondaryButtonColor: '#ecedf1',
  inputBackgroundColor: 'rgba(236, 237, 241, 0.37)',
  hyperlinkColor: '#1874e1',
  hyperlinkHoverBackgroundColor: 'rgba(24, 116, 225, 0.08)',
  defaultCategoryColor: '#9b9b9b',
  categoryTextColor: '#192b33',
  categoryDisabledColor: '#a0a8bd',
  selectedItemBorderColor: '#56a6f6',
};

const overrides = {
  MainHeader: {
    Container: {
      background: colors.base2,
      borderColor: colors.base2,
    },
    Button: {
      color: colors.lightTextColor,
      lightHover: true,
    },
  },
  SideNav: {
    Container: {
      background: colors.base2,
      borderColor: colors.base2,
    },
    Button: {
      background: colors.base2,
    },
  },
  TaskList: {
    Filter: {
      Container: {
        background: colors.base2,
        borderColor: colors.base2,
      },
    },
    Item: {
      Container: {
        borderColor: colors.base2,
        background: colors.base2,
      },
      SelectedContainer: {
        background: colors.base1,
        border: `2px solid ${colors.selectedItemBorderColor}`,
      },
    },
  },
  AgentDesktopView: {
    ContentSplitter: {
      background: colors.base1,
      borderColor: colors.base1,
    },
  },
  CRMContainer: {
    Container: {
      borderColor: colors.base2,
    },
  },
};

const HrmTheme = {
  baseName: 'HrmTheme',
  colors,
  overrides,
};

export default HrmTheme;
