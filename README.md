# Delivery app

Homework for the Elif School

## Installation

Install all necessary dependencies

```bash
npm install crypto-js firebase @mui/material @emotion/react @emotion/styled
```

Build the app with

```bash
npm run build
```

Copy contents of build folder to the root of your server.

This app has been tested with apache2 server.

This site uses browser routing which allows to update content dynamically without refreshing the page. But after you refresh page state is lost. Install the following .htaccess config to fix it:

```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

This app uses firebase for authentication and database. You need to create a firebase project and add your web app to it. Then you need to create a file named `GlobalConfig.js` in the `src` folder and add your firebase config to it.

Creat firebase project and add web app to it: https://firebase.google.com/docs/web/setup

## Example

This app has been hosted at: https://sandbox.andrax.dev

## Run development server for testing (strictly not recommended for production)

```bash
npm start
```

## License

```
Copyright (c) 2023-2024 Dmytro Ostapenko. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```