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

Coupon.propTypes = {
    code: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    discount: PropTypes.number.isRequired,
    product: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
}

function Coupon({code, description, discount, product, image, id, callback}) {
    return (
        <div className={"coupon card-center card"}>
            <img className={"coupon-image"} src={image} alt={code}/>
            <br/>
            <p className={"coupon-title"}>{discount}% discount</p>
            <br/>
            <p className={"coupon-description"}>{description}</p>
            <br/>
            <div>
                <label className={"input-label"}>Code:&nbsp;&nbsp;</label>
                <input className={"input"} type={"text"} value={code} readOnly={true}/>
            </div>
            <br/>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
            }}>
                <button className={"material-button"} onClick={() => {
                    navigator.clipboard.writeText(code).then(() => {
                        callback();
                    });
                }}>Copy code
                </button>
            </div>
        </div>
    );
}

export default Coupon;