#!/bin/sh

#Recover node modules from parent directory
mv -f ../node_modules .

npx prisma generate
npx prisma migrate dev
npx prisma db seed

if [ "$NODE_ENV" == "development" ]
then
	exec npm run start:dev
else
	exec npm run start:prod
fi
