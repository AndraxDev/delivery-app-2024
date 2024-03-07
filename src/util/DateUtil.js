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

export const getMonthWithLeadingZero = (date) => {
    let month = new Date(date).getMonth() + 1;
    return month < 10 ? `0${month}` : month.toString();
}

export const getDayWithLeadingZero = (date) => {
    let day = new Date(date).getDate();
    return day < 10 ? `0${day}` : day.toString();
}

export const getHourAndMinuteWithLeadingZero = (date) => {
    let hour = new Date(date).getHours();
    let minute = new Date(date).getMinutes();
    return `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
}