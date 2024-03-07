/*
* Copyright (c) 2024 Dmytro Ostapenko. All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* */

/* Material theme for ThemeProvider for module @mui/material */
export const BaseTheme = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#3786ff',
        },
        secondary: {
            main: '#00ffff',
        },
        error: {
            main: '#db4437',
        },
        warning: {
            main: '#ff3d00',
        },
        success: {
            main: '#2e8b57',
        },
    },

    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            // most basic recommended timing
            standard: 300,
            // this is to be used in complex animations
            complex: 375,
            // recommended when something is entering screen
            enteringScreen: 225,
            // recommended when something is leaving screen
            leavingScreen: 195,
        },
    },

    zIndex: {
        mobileStepper: 1000,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },

    /* Styled components */
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50pc',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    minWidth: 320,
                },

            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    overflowWrap: "anywhere",
                    userSelect: "text",
                },
            },
        }
    },
}
