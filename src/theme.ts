export const palette = {
  LightGrey: "#e7ecf7",
  Grey: "#b1b1b1",
  CoolGray: "#758796",
  Purple: "#00AEE9",
  ElectricBlue: "#00AEE9",
  ElectricBlueLight: "#e8f3ff",
  MintGreen: "#69FABD",
  MidnightBlue: "#1B295E",
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
      mintGreen: palette.MintGreen,
      errorText: "#ff0000",
      successText: "#14a266",
      backgroundError: "rgba(230, 0, 0, 0.4)",
      backgroundSuccess: "rgb(106 250 188 / 44%)",
      backgroundToaster: "rgba(0, 174, 233, 0.7)",
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
    body: {
      extend: (props: any) => `
        tr:first-child {
          th, td {
            border: none;
          }
        }
        
        tr {
          th, td {
            padding: 16px 12px;
          }
          td:last-child {
            text-align: right;
          }
        }
        
        tr:nth-child(even) {
          th, td {
             background-color: ${props.theme.global.colors.tableRow};
          }
        }
      `,
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
      mintGreen: palette.MintGreen,
      errorText: "#ff5858",
      successText: "#00d67b",
      backgroundError: "rgba(230, 0, 0, 0.4)",
      backgroundSuccess: "rgb(106 250 188 / 23%)",
      backgroundToaster: "rgb(93 111 181 / 70%)",
      selected: "#3c53a2",
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
