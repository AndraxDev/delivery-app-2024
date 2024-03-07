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
import {getDayWithLeadingZero, getHourAndMinuteWithLeadingZero, getMonthWithLeadingZero} from "../util/DateUtil";

Order.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    setSelection: PropTypes.func.isRequired
}

function Order({id, date, total, setSelection}) {
    return (
        <button onClick={() => {
            setSelection(id);
        }} className={"horizontal clickable cart-item"}>
            <div className={"vertical"}>
                <p className={"order-id"}>Order #{id}</p>
                <br/>
                <p className={"order-date"}>{getDayWithLeadingZero(new Date(date))}.{getMonthWithLeadingZero(new Date(date))}.{new Date(date).getFullYear()} {getHourAndMinuteWithLeadingZero(new Date(date))}</p>
            </div>
            <p className={"price"}>${total.toFixed(2)}</p>
        </button>
    );
}

export default Order;
