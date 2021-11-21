#!/bin/sh
mkdir /usr/local/dy-helloworld
touch /usr/local/dy-helloworld/version
chmod 666 /usr/local/dy-helloworld/version
echo "HELLOWORLD_VERSION=${APPLICATION_NAME}-${DEPLOYMENT_GROUP_NAME}-${DEPLOYMENT_GROUP_ID}-${DEPLOYMENT_ID}" > /usr/local/dy-helloworld/version
