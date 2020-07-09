![CaptureShare CI](https://github.com/HPaulson/CaptureShare/workflows/CaptureShare%20CI/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/hpaulson/captureshare/badge)](https://www.codefactor.io/repository/github/hpaulson/captureshare)
---
<div style="text-align:center"><img src="https://repository-images.githubusercontent.com/270843017/3dc7e180-c177-11ea-8238-624a2d79c255" /></div>
# CaptureShare: Your home for file sharing.

## Features

* REST API build using Express for uploading, getting, deleting, and managing files

* Support for POST upload requests from services such as ShareX and MagicCap

* A beautiful dashboard built using Vue to provide a home for uploading, deleting, and managing files! (NOTE: The CaptureShare dashboard is currently a Work In Progress. Although it functions as expected, currently all features and styling has not yet been implemented)

* Fast, efficient, and very easy to setup and use!
---
## Getting Started

### PreReq's:

*  [Node JS](https://nodejs.org/en/download/) - Install the latest NodeJs LTS for your operating system, Check that it's installed by running `node -v` in your terminal

*  [MongoDB Database](https://www.mongodb.com/) - This may be a [MongoDB Community Server](https://www.mongodb.com/download-center/community), or a [MongoDB Atlas Cluster](https://www.mongodb.com/download-center/cloud) (M0 free cluster works perfect!)
---
### Installing CaptureShare

* CapsureShare comes pre-built for easy install. For more information on building files to contribute, read the [Contributing Guidelines](https://github.com/HPaulson/CaptureShare/blob/master/.github/CONTRIBUTING.md).

* Install the latest [release](https://github.com/HPaulson/CaptureShare/releases) of CaptureShare, named `CaptureShare-VERSION`

* Extract the `CaptureShare-VERSION.zip` file
---
### Configuring CaptureShare

* In your project directory (Where you extracted the zip) you will find `config.json`. This file is where all of your settings and configuration will be setup

* Edit `config.json` for the options you wish to use, which can be found below

#### Server Configuration: `server`
###### Server information for how CaptureShare will run
##### Type: Object
##### Example:
```json
    "server": {
        "host": "https://google.com",
        "port": 80,
        "notAllowed": ["exe", "jar"],
        "mongoURL": "mongodb://localhost:27017/uploads",
        "useOriginalName": false,
        "nameLength": 3
    }
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `host` | `string` | The URL where CaptureShare will run - where files and content will be served | `"http://157.245.250.66:3000"`  `"https://google.com"`|
| `port` | `integer` | The port that the CaptureShare API will run on | `3000` |
| `notAllowed` | `string[]` | An array of not-allowed file types (extentions) | `["exe", "jar"]` |
| `mongoURL` | `string` | A MongoDB Connection string for the CaptureShare database to run on | Community Server: `"mongodb://127.0.0.1:27017/uploads"` Atlas Cluster: `"mongodb+srv://<username>:<password>@<Cluster>-bjoiv.mongodb.net/<dbname>?retryWrites=true&w=majority"` |
| `useOriginalName` | `boolean` | Wheather CaptureShare should use the original filename when uploading a file (Only reccomended when using the Dashboard to upload files) | `true`  `false` |
| `nameLength` | `boolean` | When `useOriginalName` is false, the length of the new generated file name | `true`  `false` |  
---
#### Users Configuration: `users`
###### Authorized users to use CaptureShare
###### Type: Array of Objects
###### Example: 
```json
    "users": [{
        "username": "user",
        "password": "1234567890"
      }, {
        "username": "user1",
         "password": "0987654321"
    }]
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `username` | `string` | The user's username | `"user"` |
| `password` | `string` | The user's password - Also used as authorization token | `"1234567890"`|
---
#### Webhook Configuration: `webhook`
###### Webhooks that will fire on specific events to log them 
###### Type: Object
###### Example: 
```json
    "webhook": {
        "url": "https://canary.discordapp.com/api/webhooks/123456789/ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "username": "Upload Server",
        "avatar": "hhttps://www.google.com/images/logo.png",
        "events": {
            "fileUpload": "```md\n[Uploaded File]\n==============\n\n< SIZE   = {size}\n< TYPE   = {type}\n< FILE   = {file}\n\n< USER  = {user}```\n{link}",
            "fileDelete": "```md\n[Removed File]\n==============\n\n< SIZE   = {size}\n< TYPE   = {type}\n< FILE   = {file}\n\n< USER  = {user}```\n{link}"
        }
    }
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `url` | `string` | The webhook URL to send log messages ti | `"https://canary.discordapp.com/api/webhooks/123456789/ABCDEFGHIJKLMNOPQRSTUVWXYZ"` |
| `username` | `string` | The username to send the webhook as | `"Upload Server"`|
| `events` | `Object` | A string to send to the webhook when that event is fired | `"fileUpload": "A file was uploaded!", "fileDelete": "A file was removed!"`|
---
#### Events Configuration: `webhook.events`
###### Events that trigger webhook messages to fire
###### Type: Array of Objects
###### Example: 
```json
    "users": [{
        "username": "user",
        "password": "1234567890"
      }, {
        "username": "user1",
         "password": "0987654321"
    }]
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `fileUpload` | `string` | Event fired when a new file is uploaded - Supports markdown | `"```md\n[Uploaded File]\n==============\n\n< SIZE   = {size}\n< TYPE   = {type}\n< FILE   = {file}\n\n< USER  = {user}```\n{link}"`|
| `fileDelete` | `string` | Event fired when a new file is uploaded - Supports markdown | `"```md\n[Removed File]\n==============\n\n< SIZE   = {size}\n< TYPE   = {type}\n< FILE   = {file}\n\n< USER  = {user}```\n{link}"`|
---
### Event Replacers
##### Replacers are used to insert file information into webhook events using curly braces
##### Example: 
```json
"```{type} {link}"
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `user` | `string` | The name of the user that caused the event | `"{user}"`|
| `file` | `string` | The name of the file that caused the event | `"{file}"`|
| `size` | `string` | The size of the file that caused the event | `"{size}"`|
| `type` | `string` | The type of the file that caused the event | `"{type}"`|
| `timestamp` | `string` | The timestamp that caused the event | `"{timestamp}"`|
| `link` | `string` | The link of the file | `"{link}"`|
---
### Meta Configuration: `meta`
##### Website meta data
##### Type: Array of Objects
##### Example: 
```json
    "meta": {
        "title": "This is a title",
        "description": "This is a description",
        "name": "This is a name",
        "url": "https://google.com",
        "image": "https://www.google.com/images/logo.png",
        "thumbnail": "https://www.google.com/images/logo.png",
        "color": "000000"
    }
```
| Property | Type | Value | Examples |
| ------------- | ---- | ------------- | --- |
| `title` | `string` | The meta title | `"This is a title"` |
| `description` | `string` | The meta description | `"This is a description"`| 
| `name` | `string` | The meta name | `"This is a name"`| 
| `url` | `string` | The meta URL | `"https://google.com"`| 
| `image` | `string` | The meta image | `"ttps://www.google.com/images/logo.png"`| 
| `thumbnail` | `string` | The meta thumbnail | `"ttps://www.google.com/images/logo.png"`| 
| `color` | `string` | The meta color in HEX | `"000000"`| 
---
## Running CaptureShare
#### Node
##### Running CaptureShare using just node 
* In the project directory, run `node index.js` to start CaptureShare
#### PM2
##### Most likely you will need to keep CaptureShare running 24/7. For this, we reccomend using [pm2](https://www.npmjs.com/package/pm2)
###### Install: 
* In the project directory:  `npm i pm2`
###### Start CaptureShare:
* In the project directory: `pm2 start index.js`
---
## Serving CaptureShare
##### For serving CaptureShare, we reccomend using an [Nginx](https://www.nginx.com/) Reverse Proxy.
#### 
###### Reccomended Config: 
```server {
    listen 80;
    server_name google.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;

        proxy_set_header   Host                 $host;
        proxy_set_header   X-Real-IP            $remote_addr;
        proxy_set_header   X-Forwarded-For      $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto    $scheme;
    }
}
```
---
## Uploading Files to CaptureShare
###### Uploading files to CaptureShare can be done using a POST request

#### Request
\* = Requiered
| Property  | Value                               |
|-----------|-------------------------------------|
| *Route       | `https://[host]/api/upload`       |
| *Header    | `authorization: [User Password]`            |
| *Header    | `content-type: multipart/form-data` |
| Header    | `client: true`(Provides more data used by the dashboard - Changes response payload) |
| *Image Body | `file`                              |


#### Response
##### Type: Object
| Property  | Value                               |
|-----------|-------------------------------------|
| url       | `https://[host]/image.png`       |

#### Client Response 
##### Contains more data for the dashboard, when `client` header is `true` - Should not be used manually
##### Type: Object
| Property  | Value     | Example                          |
|-----------|----------------|---------------------|
| status       | HTTP Status Code       | `200` |
| message       | HTTP Status message       | `OK` |
| data       | Database Data about the uploaded file     | `[{staus: 200, message: "OK", data: {_id: "file.png", uploadedAt: "2020-06-09T01:33:52.814Z", user: "user", fileType: "image/png", fileSize: "186.968KB"}}]` |
---
## Deleting Files from CaptureShare
###### Deleting files to CaptureShare can be done using a DELETE request

#### Request
###### NOTE: Using "all" as the File ID will delete all files
\* = Requiered
| Property  | Value                               |
|-----------|-------------------------------------|
| *Route       | `https://[host]/api/upload/[File ID]`       |
| *Header    | `authorization: [User Password]`            |


#### Response 
##### Type: Object
| Property  | Value     | Example                          |
|-----------|----------------|---------------------|
| status       | HTTP Status Code       | `200` |
| message       | HTTP Status message       | `OK` |
| data       |  Empty Array     | `[]` |
---
## Getting Files from CaptureShare
###### Getting files to CaptureShare can be done using a GET request

#### Request
\* = Requiered
| Property  | Value                               |
|-----------|-------------------------------------|
| *Route       | `https://[host]/api/upload/`       |
| *Header    | `authorization: [User Password]`            |


#### Response 
##### Type: Object
| Property  | Value     | Example                          |
|-----------|----------------|---------------------|
| status       | HTTP Status Code       | `200` |
| message       | HTTP Status message       | `OK` |
| data       |  Array containing database objects for all uploaded files     | `[{staus: 200, message: "OK", data: {_id: "file.png", uploadedAt: "2020-06-09T01:33:52.814Z", user: "user", fileType: "image/png", fileSize: "186.968KB"}}]` |
---
## Contributing
#### Want to contribute? Please head over to our [Contributing Guidelines](https://github.com/HPaulson/CaptureShare/blob/master/.github/CONTRIBUTING.md) to learn more!
