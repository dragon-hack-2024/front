// src/theme.ts
"use client";
import { createTheme } from "@mui/material/styles";
import {} from "next/font/google";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import { ThemeOptions } from "@mui/material";
import { CheckSquare, Square } from "lucide-react";

export const plus = Plus_Jakarta_Sans({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const theme2 = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        mode: "light",
        primary: {
            main: "#0D6EFD", // blue 600
            light: "#DAE2ff", // blue 100
            dark: "#0057CE", // blue 700
        },
    },
    components: {},
});

const theme = createTheme({
    direction: "ltr",
    palette: {
        primary: {
            main: "#5D87FF",
            light: "#ECF2FF",
            dark: "#4570EA",
        },
        secondary: {
            main: "#49BEFF",
            light: "#E8F7FF",
            dark: "#23afdb",
        },
        success: {
            main: "#13DEB9",
            light: "#E6FFFA",
            dark: "#02b3a9",
            contrastText: "#ffffff",
        },
        info: {
            main: "#539BFF",
            light: "#EBF3FE",
            dark: "#1682d4",
            contrastText: "#ffffff",
        },
        error: {
            main: "#FA896B",
            light: "#FDEDE8",
            dark: "#f3704d",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#FFAE1F",
            light: "#FEF5E5",
            dark: "#ae8e59",
            contrastText: "#ffffff",
        },
        grey: {
            50: "#F8FAFC",
            100: "#F2F6FA",
            200: "#EAEFF4",
            300: "#DFE5EF",
            400: "#7C8FAC",
            500: "#5A6A85",
            600: "#2A3547",
        },
        text: {
            primary: "#2A3547",
            secondary: "#5A6A85",
        },
        action: {
            disabledBackground: "rgba(73,82,88,0.12)",
            hoverOpacity: 0.02,
            hover: "#f6f9fc",
        },
    },
    typography: {
        fontFamily: plus.style.fontFamily,
        h1: {
            fontWeight: 600,
            fontSize: "2.25rem",
            lineHeight: "2.75rem",
            fontFamily: plus.style.fontFamily,
        },
        h2: {
            fontWeight: 600,
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
            fontFamily: plus.style.fontFamily,
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
            fontFamily: plus.style.fontFamily,
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.3125rem",
            lineHeight: "1.6rem",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.6rem",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: "1.2rem",
        },
        button: {
            textTransform: "capitalize",
            fontWeight: 400,
        },
        body1: {
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: "1.334rem",
        },
        body2: {
            fontSize: "0.75rem",
            letterSpacing: "0rem",
            fontWeight: 400,
            lineHeight: "1rem",
        },
        subtitle1: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
                    boxShadow:
                        "rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "7px",
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 46,
                    height: 27,
                    padding: 0,
                    margin: 8,
                },
                switchBase: {
                    padding: 1,
                    "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
                        transform: "translateX(16px)",
                        color: "#fff",
                        "& + $track": {
                            opacity: 1,
                            border: "none",
                        },
                    },
                },
                thumb: {
                    width: 24,
                    height: 24,
                },
                track: {
                    borderRadius: 13,
                    border: "1px solid rgb(229, 234, 239)",
                    backgroundColor: "#fafafa",
                    opacity: 1,
                    transition:
                        "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {},
                // deleteIcon: {<Circle />},
            },
        },
        MuiCheckbox: {
            defaultProps: {
                icon: <Square />,
                checkedIcon: <CheckSquare />,
            },
        },
        MuiSelect: {
            defaultProps: {
                MenuProps: {
                    disableScrollLock: true,
                },
            },
        },
    },
});

export default theme;