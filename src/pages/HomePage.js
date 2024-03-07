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

function HomePage() {
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

    return (
        <div className={"info-card"}>
            <h2 className={"about-merchant-title"}>About us</h2>
            <br/>
            <p className={"about-merchant-description"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod porta fermentum. Pellentesque vitae rutrum nisl. Vestibulum et sagittis dolor, non egestas libero. Etiam vitae vestibulum nisi, et egestas urna. Phasellus imperdiet neque a sem viverra feugiat. Etiam est diam, aliquam eu scelerisque id, faucibus at mauris. Curabitur nec vulputate elit. Mauris in maximus est. Phasellus augue eros, posuere sed auctor at, ullamcorper in turpis. Morbi sed pulvinar urna, ac tempus orci. Vestibulum imperdiet tellus suscipit turpis ornare, ultrices congue purus feugiat.</p>
            <br/><br/>
            <div className={"section-contact"}>
                <div className={"card-contact"}>
                    <h3 className={"page-subsubtitle"}>Contact</h3>
                    <br/>
                    <p className={"about-merchant-description"}>Phone: 1234567890</p>
                    <br/>
                    <p className={"about-merchant-description"}>Email: example@example.com</p>
                </div>
                <div style={{
                    width: "16px",
                    height: "16px",
                }}/>
                <div className={"map-contact card-contact"} id={"map"}>

                </div>
            </div>
            <br/>
            <p className={"placeholder-v2"}>WARNING: This is not real marketplace. It is a homework for Elif IT TechSchool.</p>
        </div>
    );
}

export default HomePage;