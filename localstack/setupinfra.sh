#!/bin/bash

# Exports all the required env variables so we can access the localstack container

echo "Exporting Localstack Required Environment Variables"

find_localstack_ip () {
    my_ip=$( ip addr | grep -oP '(?<=inet\s).*(?=\/\d*\sbrd.*\sscope\sglobal)' )
    IFS='.' read -r -a array <<< $my_ip
    localstack_ip="${array[0]}.${array[1]}.${array[2]}.$((${array[3]}-1))"
    printf "%s\n" "$localstack_ip"
}

# set localstack ip and variables
export LOCALSTACK_IP=$(find_localstack_ip)
echo "$LOCALSTACK_IP localhost.localstack.cloud" >> /etc/hosts
export LOCALSTACK_HOST=localhost.localstack.cloud
export LOCALSTACK_HOSTNAME=localhost.localstack.cloud

# Installs AWS tools and creates all resources that should exist within AWS when deploying the app

cd /app
# install softwares
apt update && apt install -y python3-pip jq dnsutils net-tools iproute2 telnet
pip3 install awscli-local awscli

cd /app/localstack

# Bootstrap
echo "Bootstrap CDK App"
cd /app
# install nodejs dependancies
yarn install

# bootstrap cdk cloud formation
DEBUG=1 yarn cdklocal bootstrap aws://000000000000/us-east-1

# install application and extract APP_DOMAIN
# deploy output: sv-exposure-alert-stack.svexposurealertapigatewaysvexposurealertrestapiEndpoint54A19BE4 = https://78xd4ytfsf.execute-api.localhost.localstack.cloud:4566/prod/
echo "installing the cdk application ..."
echo "run 'docker exec cdk_app tail -f /app/deploy.log' to see the logging"
export APP_DOMAIN=$( yarn cdklocal deploy --verbose --require-approval never 2>&1 | tee /app/deploy.log | grep -oP "(?<=https://).*(?=:4566/prod/)" )

# append the api domain name to /etc/hosts
echo "$LOCALSTACK_IP $APP_DOMAIN" >> /etc/hosts

# export the base url
export APP_BASE_URL="https://$APP_DOMAIN:4566/prod"
echo "App Url: $APP_BASE_URL"
echo "Done."