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

import React, {useEffect} from 'react';
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {get, ref, set} from "firebase/database";
import LoadingPage from "./LoadingPage";
import CartItem from "./CartItem";
import {Alert, Snackbar} from "@mui/material";
import sha256 from 'crypto-js/sha256'
import {uuidv4} from "../util/UUID";

function ShoppingCart() {

    let [cart, setCart] = React.useState({});
    let [loading, setLoading] = React.useState(true);
    let [subtotal, setSubtotal] = React.useState(0);
    let [total, setTotal] = React.useState(0);
    let [discount, setDiscount] = React.useState(0);
    let [snackbarMessage, setSnackbarMessage] = React.useState("");
    let [successSnackbar, setSuccessSnackbar] = React.useState(false);
    let [errorSnackbar, setErrorSnackbar] = React.useState(false);

    const loadCart = async () => {
        let cart = localStorage.getItem("cart");
        if (cart) {
            let product = JSON.parse(cart);

            let checkedProducts = [];

            let cartData = {};

            let productRef = ref(FIREBASE_DATABASE, `products`);

            get(productRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let p = snapshot.val();

                    for (let i = 0; i < product.length; i++) {
                        let quantity = 1;
                        for (let j = i + 1; j < product.length; j++) {
                            if (product[i] === product[j]) {
                                quantity++;
                            }
                        }

                        if (!checkedProducts.includes(product[i])) {
                            checkedProducts.push(product[i]);

                            cartData[p[product[i]].id] = {
                                id: p[product[i]].id,
                                quantity: quantity,
                                name: p[product[i]].name,
                                price: p[product[i]].price,
                                description: p[product[i]].description,
                                image: p[product[i]].image
                            };

                            setCart(cartData);
                        }
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error("Error getting data: ", error);
            });
        }
    };

    useEffect(() => {
        let sub = 0;

        for (let key in cart) {
            sub += cart[key].price * cart[key].quantity;
        }

        setSubtotal(parseFloat(sub.toFixed(10)));
    }, [cart]);

    useEffect(() => {
        setTotal(parseFloat((subtotal - (subtotal * (discount / 100))).toFixed(10)));
    }, [subtotal, discount]);

    useEffect(() => {
        setLoading(true);

        loadCart().then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
            center: {lat: 48.7090387, lng: 21.2453477},
            zoom: 8,
        });
        new window.google.maps.Marker({
            position: {lat: 48.7090387, lng: 21.2453477},
            map: map,
            title: "Teslasoft"
        });
    }, []);

    const saveCart = (cart) => {
        let _cart = [];

        Object.keys(cart).forEach((key) => {
            for (let i = 0; i < cart[key].quantity; i++) {
                _cart.push(cart[key].id);
            }
        })

        localStorage.setItem("cart", JSON.stringify(_cart));
    }

    const setProductQuantity = (id, quantity) => {
        let newCart = {};

        for (let key in cart) {
            newCart[key] = cart[key];
        }

        newCart[id].quantity = quantity;
        setCart(newCart);

        saveCart(newCart);
    }

    const deleteProduct = (id) => {
        let newCart = {};

        for (let key in cart) {
            newCart[key] = cart[key];
        }

        delete newCart[id];
        setCart(newCart);

        saveCart(newCart);
    }

    let applyCode = () => {
        let code = document.getElementById("coupon-code").value;

        let couponRef = ref(FIREBASE_DATABASE, `coupons`);

        get(couponRef).then((snapshot) => {
            if (snapshot.exists()) {
                let coupons = snapshot.val();

                let couponFound = false;

                Object.keys(coupons).forEach((key) => {
                    if (coupons[key].code === code) {
                        setDiscount(coupons[key].discount);
                        couponFound = true;
                    }
                });

                if (!couponFound) {
                    setSnackbarMessage("Invalid coupon code");
                    setErrorSnackbar(true);
                    setSuccessSnackbar(false);
                } else {
                    setSnackbarMessage("Coupon code applied");
                    setSuccessSnackbar(true);
                    setErrorSnackbar(false);
                }
            } else {
                setSnackbarMessage("Internal error");
                setErrorSnackbar(true);
                setSuccessSnackbar(false);
            }
        }).catch((error) => {
            setSnackbarMessage("No internet connection");
            setErrorSnackbar(true);
            setSuccessSnackbar(false);
        });
    }

    const closeSnackbar = () => {
        setSuccessSnackbar(false);
        setErrorSnackbar(false);
    }

    const emptyCart = () => {
        localStorage.removeItem("cart");
        setCart({});
    }

    const createOrder = () => {
        setLoading(true);

        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const zip = document.getElementById("zip").value;
        const country = document.getElementById("country").value;
        const name = document.getElementById("name").value;
        const couponCode = document.getElementById("coupon-code").value;

        if (email === "" || phone === "" || address === "" || city === "" || zip === "" || country === "" || name === "") {
            setSnackbarMessage("Please fill in all the fields marked with *");
            setErrorSnackbar(true);
            setSuccessSnackbar(false);
            setLoading(false);
            return;
        }

        if (Object.keys(cart).length === 0) {
            setSnackbarMessage("No products in the cart");
            setErrorSnackbar(true);
            setSuccessSnackbar(false);
            setLoading(false);
            return;
        }

        let userId = sha256(email);

        let orderRef = ref(FIREBASE_DATABASE, `orders/${userId}`);

        let order = {
            products: cart,
            total: total,
            subtotal: subtotal,
            discount: discount,
            coupon: discount !== 0 ? couponCode : "",
            user: {
                email: email,
                phone: phone,
                address: address,
                city: city,
                zip: zip,
                country: country,
                name: name
            },
            date: new Date().getTime(),
            id: uuidv4()
        }

        get(orderRef).then((snapshot) => {
            if (snapshot.exists()) {
                let o = [];

                snapshot.forEach(e => {
                    o.push(e.val());
                });

                pushOrder(orderRef, o, order);
            } else {
                pushOrder(orderRef, [], order);
            }
        }).catch((error) => {
            setSnackbarMessage("An error occurred while enumerating orders: " + error);
            setErrorSnackbar(true);
            setSuccessSnackbar(false);
            setLoading(false);
        });
    }

    const pushOrder = (ordersRef, orders, order) => {
        orders.push(order);

        set(ordersRef, orders).then(() => {
            setSnackbarMessage("Order placed successfully");
            setSuccessSnackbar(true);
            setErrorSnackbar(false);
            emptyCart();
            setLoading(false);
        }).catch((_error) => {
            setSnackbarMessage("Internal error: " + _error);
            setErrorSnackbar(true);
            setSuccessSnackbar(false);
            setLoading(false);
        });
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
            <h3 className={"page-title"}>Shopping Cart</h3>

            <div className={"cart-content"}>
                <div style={{
                    justifyContent: "start"
                }} className={"vertical cart-item"}>
                    <h4 className={"page-subtitle"}>Delivery info</h4>

                    <form>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>Full name *</label>
                            <input id={"name"} className={"input-fixed input"} type={"text"} placeholder={"Full name"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>Address *</label>
                            <input id={"address"} className={"input-fixed input"} type={"text"} placeholder={"Address"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>City *</label>
                            <input id={"city"} className={"input-fixed input"} type={"text"} placeholder={"City"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>ZIP code *</label>
                            <input id={"zip"} className={"input-fixed input"} type={"text"} placeholder={"ZIP code"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>Country *</label>
                            <input id={"country"} className={"input-fixed input"} type={"text"} placeholder={"Country"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>Phone *</label>
                            <input id={"phone"} className={"input-fixed input"} type={"text"} placeholder={"Phone"}/>
                        </div>
                        <div className={"input-frame"}>
                            <label className={"label-fixed input-label"}>Email *</label>
                            <input id={"email"} className={"input-fixed input"} type={"text"} placeholder={"Email"}/>
                        </div>
                    </form>
                    <br/>
                    <div id={"map"} className={"map-view"}></div>
                </div>
                <div>
                    {loading ? <LoadingPage/> : <>
                    {
                            Object.keys(cart).length === 0 ? <p style={{
                                margin: "16px"
                                }} className={"placeholder"}>No products in the cart</p> :
                                Object.keys(cart).map((key) => {
                                    return (
                                        <CartItem
                                            image={cart[key].image}
                                            quantity={cart[key].quantity}
                                            price={parseFloat(cart[key].price)}
                                            setQuantity={setProductQuantity}
                                            name={cart[key].name}
                                            id={cart[key].id}
                                            key={cart[key].id}
                                            remove={deleteProduct}/>
                                    );
                                })

                        }
                    </>}

                    <div className={"vertical cart-item"}>
                        <p style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "20px"
                        }} className={"input-label"}>Apply coupon code</p>
                        <br/>
                        <div>
                            <input id={"coupon-code"} style={{
                                width: "330px"
                            }} placeholder={"Coupon code"} disabled={Object.keys(cart).length === 0} className={"input"} type={"text"}/>
                            &nbsp;&nbsp;&nbsp;
                            <button style={{
                                width: "100px"
                            }} disabled={Object.keys(cart).length === 0} className={Object.keys(cart).length === 0 ? "material-button-disabled" : "material-button"} onClick={() => applyCode()}>Apply
                            </button>
                        </div>
                    </div>

                    <div className={"vertical cart-item"}>
                        <p className={"subtotal"}>Subtotal: ${subtotal.toFixed(2)}</p>
                        <br/>
                        <p className={"discount"}>Discount: ${(subtotal * (discount / 100)).toFixed(2)} ({discount}%)</p>
                        <hr className={"divider"}/>
                        <p className={"total"}>Total: ${total.toFixed(2)}</p>
                    </div>
                    <div style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end",
                        padding: "16px 0"
                    }} className={"vertical cart-item"}>
                        <button className={Object.keys(cart).length === 0 ? "material-button-disabled" : "material-button"} onClick={() => {
                            createOrder();
                        }} disabled={Object.keys(cart).length === 0}>Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;
