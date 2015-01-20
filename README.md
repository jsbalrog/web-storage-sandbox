# Web Storage Sandbox
This app represents a proof-of-concept for various types of HTML5 web
storage.

## Pre-requisites
* Bower and Node/NPM
* CouchDB (for PouchDB)
* Set up CORS in CouchDB `local.ini:`

```
[httpd]
enable_cors = true

[cors]
origins = *
credentials = true
methods = GET,PUT,POST,HEAD,DELETE
headers= accept, authorization, content-type, origin
```

## Installation
```bower install && npm install```

## Running
start couchdb

```grunt serve```
