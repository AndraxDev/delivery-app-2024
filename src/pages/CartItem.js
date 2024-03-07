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

CartItem.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    setQuantity: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
}

function CartItem({name, price, image, id, quantity, setQuantity, remove}) {
    return (
        <div className={"cart-item"}>
            <img className={"cart-item-picture"} src={image} alt={name}/>
            &nbsp;&nbsp;&nbsp;
            <div className={"cart-product-content"}>
                <p className={"cart-product-name"}>{name}</p>

                <div className={"cart-product-actions"}>
                    <p className={"price"}>${(price*quantity).toFixed(2)} (${price.toFixed(2)}/item)</p>
                    &nbsp;&nbsp;&nbsp;
                    <div className={"quantity-block"}>
                        <button className={"quantity-button"} onClick={() => {
                            if (quantity > 1) {
                                setQuantity(id, quantity - 1);
                            }
                        }}>-
                        </button>
                        <p className={"quantity"}>&nbsp;&nbsp;{quantity}&nbsp;&nbsp;</p>
                        <button className={"quantity-button"} onClick={() => {
                            if (quantity < 20) {
                                setQuantity(id, quantity + 1);
                            }
                        }}>+
                        </button>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <button className={"remove-button"} onClick={() => {
                        remove(id);
                    }}>X
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;