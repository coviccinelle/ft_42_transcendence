#!/bin/sh

#Recover node modules from parent directory
cp -r ../node_modules .

if [ "$NODE_ENV" == "development" ]
then
	exec npm run dev
else
	exec npm run build
fi
