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
import LoadingPage from "./LoadingPage";
import sha256 from "crypto-js/sha256";
import {Alert, Snackbar} from "@mui/material";
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {get, ref} from "firebase/database";
import Order from "../views/Order";
import {getDayWithLeadingZero, getHourAndMinuteWithLeadingZero, getMonthWithLeadingZero} from "../util/DateUtil";

function MyOrders() {

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [orderSelected, setOrderSelected] = useState(null);

    const [products, setProducts] = useState([]);

    let [snackbarMessage, setSnackbarMessage] = React.useState("");
    let [errorSnackbar, setErrorSnackbar] = React.useState(false);
    let [successSnackbar, setSuccessSnackbar] = React.useState(false);

    useEffect(() => {
        if(localStorage.getItem("userId") === null) {
            setLoading(false);
        } else {
            setUserId(localStorage.getItem("userId"));
        }
    }, []);

    useEffect(() => {
        if (userId === null) {
            return;
        }

        setLoading(true);
        let ordersRef = ref(FIREBASE_DATABASE, "orders/" + userId);

        get(ordersRef).then((snapshot) => {
            if (snapshot.exists()) {
                let orders = [];

                snapshot.val().forEach(e => {
                    orders.push(e);
                })

                setLoading(false);
                setOrders(orders);
            } else {
                setLoading(false);
                setOrders([]);
            }
        }).catch((error) => {
            setErrorSnackbar(true);
            setSnackbarMessage("Error getting data: " + error);
        })
    }, [userId]);

    useEffect(() => {
        if (orderSelected !== null) {
            orders.forEach(
                order => {
                    if (order.id === orderSelected) {
                        setSelectedOrder(order);
                    }
                }
            )
        }
    }, [orders, orderSelected]);

    useEffect(() => {
        if (selectedOrder !== null && selectedOrder.products !== null) {
            setProducts(selectedOrder.products);
        }
    }, [selectedOrder]);

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
            <h2 className={"page-subtitle"}>My orders</h2>
            <div className={"cart-content"}>
                <div>
                    <div className={"vertical cart-item"}>
                        <h3 className={"page-subsubtitle"}>Can't find you order?</h3>
                        <br/>
                        <p className={"about-merchant-description"}>Enter your email to access your orders</p>
                        <br/>
                        <div>
                            <input className={"input-fixed input"} id={"email"} type={"email"} placeholder={"Email"}/>
                            &nbsp;&nbsp;&nbsp;
                            <button className={"material-button"} onClick={() => {
                                if (document.getElementById("email").value === "") {
                                    setSnackbarMessage("Please enter your email");
                                    setErrorSnackbar(true);
                                } else {
                                    setUserId(sha256(document.getElementById("email").value).toString());
                                    localStorage.setItem("userId", sha256(document.getElementById("email").value).toString());
                                }
                            }}>Search</button>
                        </div>
                    </div>

                    {orders.length === 0 ? <p style={{marginLeft: "16px"}} className={"placeholder"}>No orders found</p> : orders.map((order, index) => {
                        return (<Order id={order.id} date={order.date} total={order.total} setSelection={setOrderSelected} key={order.id}/>);
                    })}
                </div>
                <div>
                    <div className={"vertical cart-item"}>
                        {orderSelected === null || selectedOrder === null ? <p className={"placeholder-v3"}>Select an order to view it</p> : <>
                            <h3 className={"page-subsubtitle"}>Order details</h3>
                            <br/>
                            <p className={"order-id-v2"}>Order ID: {selectedOrder.id}</p>

                            <p className={"about-merchant-description"}>Date: {getDayWithLeadingZero(new Date(selectedOrder.date))}.{getMonthWithLeadingZero(new Date(selectedOrder.date))}.{new Date(selectedOrder.date).getFullYear()} {getHourAndMinuteWithLeadingZero(new Date(selectedOrder.date))}</p>
                            <br/>
                            <p className={"total-v2"}>Total: ${selectedOrder.total.toFixed(2)} {selectedOrder.discount !== 0 ? `(${selectedOrder.discount}% discount applied)` : ""}</p>
                        </>}
                    </div>

                    { products === null || products.length === 0 ? null : Object.values(products).map((product) => {
                        return (
                            <div className={"horizontal cart-item"} key={product.id}>
                                <img className={"cart-item-picture"} src={product.image} alt={product.name}/>
                                &nbsp;&nbsp;&nbsp;
                                <div className={"cart-product-content"}>
                                    <p className={"cart-product-name"}>{product.name}</p>
                                    <p className={"product-description"}>Price: ${(parseFloat(product.price)*product.quantity).toFixed(2)} for {product.quantity} item(s) (${parseFloat(product.price).toFixed(2)}/item)</p>
                                    <br/>
                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-end"
                                    }}>
                                        <button className={"material-button"} onClick={() => {
                                            let cart = localStorage.getItem("cart");

                                            if (cart) {
                                                cart = JSON.parse(cart);
                                            } else {
                                                cart = [];
                                            }

                                            cart.push(product.id);

                                            localStorage.setItem("cart", JSON.stringify(cart));
                                            setSnackbarMessage("Product added to cart");
                                            setSuccessSnackbar(true);
                                        }}>Order again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyOrders;