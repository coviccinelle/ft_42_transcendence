#!/bin/sh

#Recover node modules from parent directory
cp -r ../node_modules .

npx prisma generate
npx prisma db push --accept-data-loss
# npx prisma migrate dev # `prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.
npx prisma db seed

if [ "$NODE_ENV" == "development" ]
then
	exec npm run start:dev
else
	exec npm run start:prod
fi
