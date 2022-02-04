# Unified explorer

A web page that unifies all the nodes and gateways from all the TF Grid networks.

https://explorer.threefold.io

Owner: @dylanverstraete

## Prerequisites

- Redis running localhost on port `6379`.

## Running in production

The frontend is pre-built, no need to build it again. Only start server in production.

```
cd server
yarn
node bin/www
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

Network query paremeter: ThreeFold grid network type.

Query params allowed for all requests `['network=mainnet', 'network=testnet', 'network=devnet', 'network=all']`

If you don't provide the network query parameter the default `all` is chosen and will return items from all the networks combined.

#### Nodes:
`/api/nodes`

Local example:
`localhost:5000/api/nodes?network=mainnet`

Explorer example:
`https://explorer.threefold.io/api/nodes?network=all`

#### Farms:
`/api/farms`

#### Gateways
`/api/gateways`

#### Stats
`/api/stats`

Example:
`localhost:5000/api/stats?network=all`

Explorer example:
`https://explorer.threefold.io/api/stats?network=all`
