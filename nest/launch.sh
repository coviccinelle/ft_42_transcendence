#!/bin/sh

#Recover node modules from parent directory
cp -r ../node_modules .

# npx prisma generate
npx prisma migrate dev

if [ "$NODE_ENV" == "development" ]
then
	exec npm run start:dev
else
	exec npm run start:prod
fi
