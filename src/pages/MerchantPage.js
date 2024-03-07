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
import { useParams } from "react-router-dom";
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {get, ref} from "firebase/database";
import Product from "../views/Product";
import LoadingPage from "./LoadingPage";
import {Alert, Snackbar} from "@mui/material";

const productRef = ref(FIREBASE_DATABASE, 'products');

function MerchantPage() {
    let { id } = useParams();

    let [products, setProducts] = useState([]);

    let [merchantInfo, setMerchantInfo] = useState(null);

    let [loading, setLoading] = useState(true);

    let [cartSnackbarOpened, setCartSnackbarOpened] = useState(false);

    /* Load products for the selected merchant */
    useEffect(() => {
        setLoading(true);
        if (merchantInfo !== null) {
            get(productRef).then((snapshot) => {
                if (snapshot.exists()) {
                    /* Map to array */
                    let products = [];
                    snapshot.forEach(e => {
                        /* Check data for integrity */
                        if (e.val().id !== undefined
                            && e.val().merchant !== undefined
                            && e.val().name !== undefined
                            && e.val().description !== undefined
                            && e.val().price !== undefined
                            && e.val().image !== undefined
                            && e.val().merchant === merchantInfo.id) {
                            products.push(e.val());
                        }
                    })

                    setLoading(false)

                    setProducts(products);
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error("Error getting data: ", error);
            });
        }
    }, [merchantInfo]);

    /* Load merchant info */
    useEffect(() => {
        const merchantRef = ref(FIREBASE_DATABASE, `merchants/${id}`);
        get(merchantRef).then((snapshot) => {
            if (snapshot.exists()) {
                setMerchantInfo(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error("Error getting data: ", error);
        });
    }, [id]);

    const closeCartSnackbar = () => {
        setCartSnackbarOpened(false);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Snackbar
                open={cartSnackbarOpened}
                autoHideDuration={6000}
                transitionDuration={500}
                onClose={closeCartSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>

                <Alert
                    onClose={closeCartSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    The item has been added to your cart!
                </Alert>
            </Snackbar>
            {
                loading ? <LoadingPage/> :
                    <>
                        {merchantInfo === null ? <p className={"placeholder"}><span></span>Info about this merchant is not currently available. Try again later or check your Internet connection.</p> :
                            <>
                                <div className={"info-card"}>
                                    <h2 className={"about-merchant-title"}>About {merchantInfo.name}</h2>
                                    <br/>
                                    <p className={"about-merchant-description"}>{merchantInfo.description}</p>
                                </div>

                                <div className={"products-grid"}>
                                {products.length === 0 ? <p className={"placeholder"}>No products found</p> :
                                        products.map((product, index) => {
                                            return (
                                                <Product
                                                    image={product.image}
                                                    price={parseFloat(product.price)}
                                                    name={product.name}
                                                    description={product.description}
                                                    id={product.id}
                                                    key={product.id}
                                                    openSnackbar={setCartSnackbarOpened}/>
                                            );
                                        })
                                    }
                                </div>
                            </>
                        }
                    </>
            }
        </div>
    );
}

export default MerchantPage;