export const palette = {
  WhiteGrey: "#F4F7F9",
  LightGrey: "#e7ecf7",
  Grey: "#b1b1b1",
  CoolGray: "#758796",
  WhiteBlue: '#EFF8FF',
  Purple: "#00AEE9",
  ElectricBlue: "#00AEE9",
  ElectricBlueLight: "#e8f3ff",
  WhiteGreen: '#dafef4',
  MintGreen: "#69FABD",
  DarkGreen: '#019267',
  MidnightBlue: "#1B295E",
  WhiteBrown: '#f7eacc',
  GoldenBrown: '#b47d00'
};

export const theme = {
  global: {
    focus: {
      border: {
        color: "transparent",
      },
    },
    colors: {
      text: '#55626d',
      brand: palette.Purple,
      background: "white",
      backgroundBack: "#f3f3f3",
      backgroundEmptyIcon: "#e8e6e6",
      backgroundDropdownItem: "#fdf9f9",
      backgroundBackEmpty: "#f3f3f3",
      border: palette.LightGrey,
      headerText: "#ffffff",
      majorText: palette.MidnightBlue,
      minorText: palette.CoolGray,
      iconMain: palette.ElectricBlue,
      tableRow: palette.ElectricBlueLight,
      tableRowHover: palette.WhiteGrey,
      mintGreen: palette.MintGreen,
      errorText: "#ff0000",
      successText: "#14a266",
      backgroundError: "rgba(230, 0, 0, 0.4)",
      backgroundSuccess: "rgb(106 250 188 / 44%)",
      backgroundToaster: "rgba(0, 174, 233, 0.7)",
      backgroundTip: palette.MidnightBlue,
      backgroundMark: palette.WhiteBlue,
      warning: palette.GoldenBrown,
      warningBackground: palette.WhiteBrown,
      success: palette.DarkGreen,
      successBackground: palette.WhiteGreen,
    },
    palette,
    select: {
      clear: {
        color: "brand",
      },
    },
    font: {
      family: "Nunito",
      // family: "Fira Sans",
      size: "14px",
      height: "20px",
    },
  },
  anchor: {
    textDecoration: "none",
    hover: {
      textDecoration: "none",
    },
  },
  button: {
    // backgroundColor: "transparent",
    color: "brand",
    borderColor: "brand",
  },
  dataTable: {
    border: {
      header: {
        color: 'border'
      }
    },
    body: {
      extend: (props: any) => `
        
        tr {
          th, td {
            padding: 16px 8px;
          }
          td:last-child {
            text-align: right;
          }
        }

        tr:hover {
          background-color: ${props.theme.global.colors.tableRowHover};
        }
      `
    },
  },
};

export const darkTheme = {
  ...theme,
  select: {
    container: {
      extend: () => [{ color: "#ffffff", background: palette.MidnightBlue }],
    },
  },
  global: {
    focus: {
      border: {
        color: "transparent",
      },
    },
    hover: {
      background: "#111f4e",
    },
    colors: {
      brand: palette.MintGreen,
      background: palette.MidnightBlue,
      backgroundBack: "#030921",
      backgroundDropdownItem: "#111f4e",
      backgroundEmptyIcon: "#324a92",
      border: "#375873",
      headerText: "#ffffff",
      majorText: palette.MidnightBlue,
      minorText: "#5f98c7",
      iconMain: palette.ElectricBlue,
      tableRow: "#122852",
      tableRowHover: '#1b3e7f',
      mintGreen: palette.MintGreen,
      errorText: "#ff5858",
      successText: "#00d67b",
      backgroundError: "rgba(230, 0, 0, 0.4)",
      backgroundSuccess: "rgb(106 250 188 / 23%)",
      backgroundToaster: "rgb(93 111 181 / 70%)",
      selected: "#3c53a2",
      backgroundTip: '#22577E',
      backgroundMark: '#3660ad',
      warning: palette.GoldenBrown,
      warningBackground: palette.WhiteBrown,
      success: palette.DarkGreen,
      successBackground: palette.WhiteGreen,
    },
    palette,
    font: {
      family: "Nunito",
      // family: "Fira Sans",
      size: "14px",
      height: "20px",
    },
  },
};
