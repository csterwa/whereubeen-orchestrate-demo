# Where U Been? Orchestrate Geolocation Demo

Demo application for Orchestrate and its location capabilities along with AppFog deployment.

## Setup Local Development Environment

For local development we must setup two environment variables in our current terminal shell. You can get these from your Orchestrate database dashboard.

```
$ export ORCHESTRATE_API_KEY=[YOUR API KEY]
$ export ORCHESTRATE_API_HOST=[YOUR API HOST (i.e. api.ctl-uc1-a.orchestrate.io)]
```

## Running Application

After the environment variables are exported in your terminal's shell session you can start the application.

```
$ npm install
$ npm start

> whereubeen@1.0.0 start /Users/csterling/projects/hack/whereubeen
> node index.js

Example app listening at http://:::5000
```
