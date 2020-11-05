# Unified explorer

A web page that unifies all the nodes and gateways from all the TF Grid networks.

Owner: @dylanverstraete

## Prerequisites

- Redis running localhost on port `6379`.

## Running in production

```
cd server
yarn
yarn start
```

This will run the application on http://locahost:5000

## Rebuilding for production

```
cd frontend
yarn
yarn run build
```

## Running in development

### Backend

```
cd server
yarn
yarn start
```

### Frontend 

```
cd frontend
yarn install
yarn run serve
```
