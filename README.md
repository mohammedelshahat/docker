# AWA Server
This project includes AWA NodeJS server.

## perquisites
- nodejs v12
- [A running HyperLedger Fabric network](https://gitlab.com/Fagr/awa-chaincode.git)

## Installation
- before starting the server, you should've the [awa-chaincode](https://gitlab.com/Fagr/awa-chaincode.git) project up and running.
- clone this repo
```shell
git clone https://gitlab.com/Fagr/awa-server.git
```
- install dependencies
```shell
npm i
```
- copy the connection profile JSON files to `/fabric/secure/` -- *make sure you are at the root of the server*
```
cp /<path to awa-chaincode>/connection-org* ./fabric/secure/
```
- don't forget to create `.env` file with the required variables
- enroll admin and register user to interact with the Blockchain
```
npm run register:fabric
```

## Check for deployed contracts
- to check that everything is working as expected, the chaincodes are up and accessible:
```
npm run checkCC:fabric
```

## Start the server
- starting the server in development mode
```
npm run dev
```
- starting the server in normal mode
```
npm start
```

## Documentation
- [Postman collection](https://documenter.getpostman.com/view/6775655/T1LHGUvp?version=latest)

## Teardown
- Don't forget to delete user's wallet and connection profiles when tearing down the network
```
cd fabric/secure && rm wallet/*.id && rm connection-org*
```

## Possible Issues

- Failed to enroll admin user : TypeError: Cannot read property 'tlsCACerts' of undefined

- Add default affilation of IBM Blockchain platfrom `ibp`

- Add attributes to identity to be able to interact with the smart contract
  `hf.Revoker = true`

  `hf.Registrar.Roles = peer,client,admin,orderer`
