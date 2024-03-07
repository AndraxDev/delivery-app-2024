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
import SidebarElement from "./SidebarElement";
import {FIREBASE_DATABASE} from "../GlobalConfig";
import {ref, get} from "firebase/database";
import LoadingView from "./LoadingView";

const merchantsRef = ref(FIREBASE_DATABASE, 'merchants');

function Sidebar() {

    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        get(merchantsRef).then((snapshot) => {
            if (snapshot.exists()) {
                /* Map to array */
                let merchants = [];
                snapshot.forEach(e => {
                    /* Check data for integrity */
                    if (e.val().id !== undefined
                        && e.val().name !== undefined
                        && e.val().description !== undefined
                        && e.val().image !== undefined) {
                        merchants.push(e.val());
                    }
                })

                setLoading(false);

                setMerchants(merchants);
            } else {
                console.log("No data available");
                setLoading(false);
                setMerchants([]);
            }
        }).catch((error) => {
            console.error("Error getting data: ", error);
        });
    }, []);

    return (
        <div className="sidebar">
            <h3 className={"sidebar-title"}>Shops</h3>
            {
                loading ? <LoadingView/> :
                    <>
                        {merchants.length === 0 ? <p className={"placeholder"}>No merchants found</p> :
                            merchants.map((merchant, index) => {
                                return (
                                    <SidebarElement
                                        merchantLogo={merchant.image}
                                        merchantName={merchant.name}
                                        key={merchant.id}
                                        id={merchant.id}/>
                                );
                            })
                        }
                    </>
            }
        </div>
    );
}

export default Sidebar;
