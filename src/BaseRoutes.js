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
import {Route, Routes} from "react-router-dom";
import MerchantPage from "./pages/MerchantPage";
import HomePage from "./pages/HomePage";
import ShoppingCart from "./pages/ShoppingCart";
import MyOrders from "./pages/MyOrders";
import Sidebar from "./views/Sidebar";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Coupons from "./pages/Coupons";

function BaseRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <>
                    <Sidebar/>
                    <div className="content content-with-sidebar">
                        <HomePage/>
                    </div>
                </>
            } exact/>
            <Route path="/merchant/:id" element={
                <>
                    <Sidebar/>
                    <div className="content content-with-sidebar">
                        <MerchantPage/>
                    </div>
                </>
            }/>
            <Route path="/admin" element={
                <div className="content content-fullwidth">
                    <Admin/>
                </div>
            } exact/>
            <Route path="/cart" element={
                <div className="content content-fullwidth">
                    <ShoppingCart/>
                </div>
            } exact/>
            <Route path="/orders" element={
                <div className="content content-fullwidth">
                    <MyOrders/>
                </div>
            } exact/>
            <Route path="/coupons" element={
                <div className="content content-fullwidth">
                    <Coupons/>
                </div>
            } exact/>
            <Route path="*" element={
                <div className="content content-fullwidth">
                    <NotFound/>
                </div>
            } exact/>
        </Routes>
    );
}

export default BaseRoutes;