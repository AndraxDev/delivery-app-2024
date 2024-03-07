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

/* DEBUG PAGE, Boilerplate code may be here */
import React from 'react';
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {set, ref} from "firebase/database";
import {uuidv4} from "../util/UUID";
import LoadingPage from "./LoadingPage";
import {Alert, Snackbar} from "@mui/material";

function Admin() {

    let [snackbarMessage, setSnackbarMessage] = React.useState("");
    let [errorSnackbar, setErrorSnackbar] = React.useState(false);
    let [successSnackbar, setSuccessSnackbar] = React.useState(false);
    let [loading, setLoading] = React.useState(false);

    const createMerchant = (name, description, image) => {
        setLoading(true);
        let newId = uuidv4();
        let databaseReference = ref(FIREBASE_DATABASE, `merchants/${newId}`);

        let newMerchant = {
            name: name,
            description: description,
            image: image,
            id: newId
        };

        set(databaseReference, newMerchant).then(() => {
            setLoading(false);
            setSnackbarMessage("Merchant created");
            setSuccessSnackbar(true);
            setErrorSnackbar(false);
        }).catch((error) => {
            setLoading(false);
            setSnackbarMessage("Error creating merchant: " + error);
            setSuccessSnackbar(false);
            setErrorSnackbar(true);
        });
    }

    const createProduct = (name, description, price, image, merchant) => {
        setLoading(true);
        let newId = uuidv4();
        let databaseReference = ref(FIREBASE_DATABASE, `products/${newId}`);

        let newProduct = {
            name: name,
            description: description,
            price: price,
            image: image,
            merchant: merchant,
            id: newId
        };

        set(databaseReference, newProduct).then(() => {
            setLoading(false);
            setSnackbarMessage("Product created");
            setSuccessSnackbar(true);
            setErrorSnackbar(false);
        }).catch((error) => {
            setLoading(false);
            setSnackbarMessage("Error creating product: " + error);
            setSuccessSnackbar(false);
            setErrorSnackbar(true);
        });
    }

    const createCoupon = (code, description, discount, product, image) => {
        setLoading(true);
        let newId = uuidv4();
        let databaseReference = ref(FIREBASE_DATABASE, `coupons/${newId}`);

        let newCoupon = {
            code: code,
            description: description,
            discount: discount,
            product: product,
            id: newId,
            image: image
        };

        set(databaseReference, newCoupon).then(() => {
            setLoading(false);
            setSnackbarMessage("Coupon created");
            setSuccessSnackbar(true);
            setErrorSnackbar(false);
        }).catch((error) => {
            setLoading(false);
            setSnackbarMessage("Error creating coupon: " + error);
            setSuccessSnackbar(false);
            setErrorSnackbar(true);
        });
    }

    const closeSnackbar = () => {
        setErrorSnackbar(false);
        setSuccessSnackbar(false);
    }

    return (
        <div>
            {loading ? <LoadingPage/> : null}
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
            <h2 className={"page-title"}>Admin</h2>
            <div className={"cart-content"}>
                <form className={"vertical cart-item"} id="create-merchant">
                    <h3 className={"page-subtitle"}>Create merchant</h3>
                    <label className={"input-label"}>
                        Merchant name:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="name" id="name"/>
                    </label>
                    <label className={"input-label"}>
                        Merchant description:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="description" id="description"/>
                    </label>
                    <label className={"input-label"}>
                        Merchant image:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="image" id="image"/>
                    </label>
                    <br/>
                    <input className={"material-button"} type="submit" value="Create" onClick={(e) => {
                        e.preventDefault();

                        if (!document.getElementById("name").value) {
                            setSnackbarMessage("Merchant name is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("description").value) {
                            setSnackbarMessage("Merchant description is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("image").value) {
                            setSnackbarMessage("Merchant image is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        createMerchant(
                            document.getElementById("name").value,
                            document.getElementById("description").value,
                            document.getElementById("image").value
                        );

                        document.getElementById("create-merchant").reset();
                    }}/>
                </form>

                <form className={"vertical cart-item"} id="create-product">
                    <h3 className={"page-subtitle"}>Create product</h3>
                    <label className={"input-label"}>
                        Product name:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="name" id="product-name"/>
                    </label>
                    <label className={"input-label"}>
                        Product description:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="description" id="product-description"/>
                    </label>
                    <label className={"input-label"}>
                        Product price:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="price" id="product-price"/>
                    </label>
                    <label className={"input-label"}>
                        Product image:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="image" id="product-image"/>
                    </label>
                    <label className={"input-label"}>
                        Product merchant UUID:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="merchant" id="product-merchant"/>
                    </label>
                    <br/>
                    <input className={"material-button"} type="submit" value="Create" onClick={(e) => {
                        e.preventDefault()

                        if (!document.getElementById("product-name").value) {
                            setSnackbarMessage("Product name is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("product-description").value) {
                            setSnackbarMessage("Product description is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("product-price").value) {
                            setSnackbarMessage("Product price is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("product-image").value) {
                            setSnackbarMessage("Product image is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("product-merchant").value) {
                            setSnackbarMessage("Product merchant is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        createProduct(
                            document.getElementById("product-name").value,
                            document.getElementById("product-description").value,
                            document.getElementById("product-price").value,
                            document.getElementById("product-image").value,
                            document.getElementById("product-merchant").value
                        );

                        document.getElementById("create-product").reset();
                    }}/>
                </form>

                <form className={"vertical cart-item"} id="create-coupon">
                    <h3 className={"page-subtitle"}>Create coupon</h3>
                    <label className={"input-label"}>
                        Coupon code:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="code" id="coupon-code"/>
                    </label>
                    <label className={"input-label"}>
                        Coupon description:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="description" id="coupon-description"/>
                    </label>
                    <label className={"input-label"}>
                        Coupon discount:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="discount" id="coupon-discount"/>
                    </label>
                    <label className={"input-label"}>
                        Coupon product UUID:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="product" id="coupon-product"/>
                    </label>
                    <label className={"input-label"}>
                        Coupon image:&nbsp;&nbsp;&nbsp;<input className={"input"} type="text" name="image" id="coupon-image"/>
                    </label>
                    <br/>
                    <input className={"material-button"} type="submit" value="Create" onClick={(e) => {
                        e.preventDefault()

                        if (!document.getElementById("coupon-code").value) {
                            setSnackbarMessage("Coupon code is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("coupon-description").value) {
                            setSnackbarMessage("Coupon description is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("coupon-discount").value) {
                            setSnackbarMessage("Coupon discount is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("coupon-product").value) {
                            setSnackbarMessage("Coupon merchant is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        if (!document.getElementById("coupon-image").value) {
                            setSnackbarMessage("Coupon image is required");
                            setSuccessSnackbar(false);
                            setErrorSnackbar(true);
                            return;
                        }

                        createCoupon(
                            document.getElementById("coupon-code").value,
                            document.getElementById("coupon-description").value,
                            document.getElementById("coupon-discount").value,
                            document.getElementById("coupon-product").value,
                            document.getElementById("coupon-image").value
                        );

                        document.getElementById("create-coupon").reset();
                    }}/>
                </form>
            </div>
        </div>
    );
}

export default Admin;
