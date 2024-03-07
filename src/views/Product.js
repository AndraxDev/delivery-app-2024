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

import React from 'react';
import PropTypes from "prop-types";

Product.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    openSnackbar: PropTypes.func.isRequired
}

function Product({name, price, description, image, id, openSnackbar}) {
    return (
        <div className={"card"}>
            <img className={"photo"} src={image} alt={name}/>
            <br/><br/>
            <p className={"product-title"}>{name}</p>
            <br/>
            <p className={"product-description"}>{description}</p>
            <br/>
            <div className={"card-actions"}>
                <p className={"price"}>${price.toFixed(2)}</p>
                &nbsp;&nbsp;&nbsp;
                <button className={"material-button"} onClick={() => {
                    let cart = localStorage.getItem("cart");

                    if (cart) {
                        cart = JSON.parse(cart);
                    } else {
                        cart = [];
                    }

                    cart.push(id);

                    localStorage.setItem("cart", JSON.stringify(cart));
                    openSnackbar(true)
                }}>Add to cart
                </button>
            </div>
        </div>
    );
}

export default Product;
