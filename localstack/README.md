# Localstack Test App

## What is this?
This directory includes the files to run localstack and deploy a cdk application into it.

## How to Deploy for the first time
You need docker and docker-compose.

0. Copy and edit the `.env.template` file to `.env`. Make sure to enter your localstack API key.

1. Run

```bash
docker compose up
```

to spin up the localstack container and cdk application container.
when run the command, make sure the .env file includes needed information like the environment variables needed for localstack. Copy the template in [.env.template](./.env.template) to `.env` in the same directory, and fill in the missing items.

2. Run

```bash
docker exec -it cdk_app bash
cd /app/localstack
. setupinfra.sh
```

3. Send a GET request to the domain that is printed out in the console, to `/sign`. You can do this from the host OS.
   This domain will be random and new for every deployment.

   Example: `GET https://h8a38crrlx.execute-api.localhost.localstack.cloud:4566/prod/sign`