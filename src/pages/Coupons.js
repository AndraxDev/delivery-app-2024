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

import React, {useEffect, useState} from 'react';
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {get, ref} from "firebase/database";
import LoadingPage from "./LoadingPage";
import Coupon from "../views/Coupon";
import {Alert, Snackbar} from "@mui/material";

const couponsRef = ref(FIREBASE_DATABASE, "coupons");

function Coupons() {

    let [coupons, setCoupons] = useState([]);
    let [loading, setLoading] = useState(true);
    let [snackbarMessage, setSnackbarMessage] = React.useState("");
    let [errorSnackbar, setErrorSnackbar] = React.useState(false);
    let [successSnackbar, setSuccessSnackbar] = React.useState(false);

    useEffect(() => {
        setLoading(true);
        get(couponsRef).then((snapshot) => {
            if (snapshot.exists()) {
                /* Map to array */
                let coupons = [];
                snapshot.forEach(e => {
                    /* Check data for integrity */
                    if (e.val().id !== undefined
                        && e.val().code !== undefined
                        && e.val().description !== undefined
                        && e.val().discount !== undefined
                        && e.val().product !== undefined
                        && e.val().image !== undefined) {
                        coupons.push(e.val());
                    }
                })

                setLoading(false);

                setCoupons(coupons);
            } else {
                console.log("No data available");
                setLoading(false);
                setCoupons([]);
            }
        }).catch((error) => {
            console.error("Error getting data: ", error);
        });
    }, []);

    const copyCallback = () => {
        setSuccessSnackbar(true);
        setSnackbarMessage("Coupon code copied to clipboard");
    }

    const closeSnackbar = () => {
        setErrorSnackbar(false);
        setSuccessSnackbar(false);
    }

    return (
        <div>
            <Snackbar
                open={successSnackbar}
                autoHideDuration={6000}
                transitionDuration={500}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>

                <Alert
                    onClose={closeSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSnackbar}
                autoHideDuration={6000}
                transitionDuration={500}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>

                <Alert
                    onClose={closeSnackbar}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {loading ? <LoadingPage/> : <div className={"products-grid"}>
                {
                    coupons.length === 0 ? <p>No coupons found</p> :
                        coupons.map((coupon, index) => {
                            return (
                                <Coupon
                                    code={coupon.code}
                                    description={coupon.description}
                                    discount={parseFloat(coupon.discount.toString())}
                                    product={coupon.product}
                                    image={coupon.image}
                                    id={coupon.id}
                                    callback={copyCallback}
                                    key={coupon.id}/>
                            );
                        })
                }
            </div>}
        </div>
    );
}

export default Coupons;