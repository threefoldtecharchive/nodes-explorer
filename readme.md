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

## API docs

Available endpoints:

Query params allowed for all requests `['network=mainnet', 'network=testnet', 'network=devnet', 'network=all']`

#### Nodes:
`/api/nodes`

Example:
`localhost:5000/api/nodes?network=mainnet`

#### Farms:
`/api/farms`

#### Gateways
`/api/gateways`

#### Stats
`/api/stats`

Example:
`localhost:5000/api/stats?network=all`