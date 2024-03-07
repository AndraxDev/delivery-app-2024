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
import {useNavigate} from "react-router-dom";

/* Props validation */
SidebarElement.propTypes = {
    merchantLogo: PropTypes.string.isRequired,
    merchantName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
}

function SidebarElement({merchantLogo, merchantName, id}) {

    const navigate = useNavigate();

    return (
        <>
            <div className={"shop-sidebar"}>
                <button className={"btn-transparent"} onClick={() => {
                    navigate(`/merchant/${id}`);
                }}>
                    <img className={"merchant-logo"} src={merchantLogo} alt={merchantName}/>
                    <p className={"merchant-name"}>{merchantName}</p>
                    <br/>
                </button>
            </div>
            <br/>
        </>
    );
}

export default SidebarElement;
