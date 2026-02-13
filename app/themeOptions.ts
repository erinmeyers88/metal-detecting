import type { ThemeOptions } from '@mui/material/styles';
import type { ThemeMode } from '@/app/store/slices/themeSlice';

const baseThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'var(--font-source-sans), sans-serif',
    button: {
      fontFamily: 'var(--font-oswald), sans-serif',
    },
  },
  components: {
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
};

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: '#7cb342',
  },
  secondary: {
    main: '#795548',
  },
  success: {
    main: '#2196f3',
  },
  info: {
    main: '#673ab7',
  },
  background: {
    default: '#efebe9',
    paper: '#fafafa',
  },
};

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#7cb342',
  },
  secondary: {
    main: '#795548',
  },
  success: {
    main: '#2196f3',
  },
  info: {
    main: '#673ab7',
  },
  background: {
    default: '#212121',
    paper: '#303030',
  },
  text: {
    primary: '#f5f5f5',
    secondary: '#d0d0d0',
  },
  divider: 'rgba(255, 255, 255, 0.16)',
};

export const getThemeOptions = (mode: ThemeMode): ThemeOptions => ({
  ...baseThemeOptions,
  palette: mode === 'dark' ? darkPalette : lightPalette,
});
