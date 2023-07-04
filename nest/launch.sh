#!/bin/sh

#Recover node modules from parent directory
mv ../node_modules .

if [ "$NODE_ENV" == "development" ]
then
	exec npm run start:dev
else
	exec npm run start:prod
fi
