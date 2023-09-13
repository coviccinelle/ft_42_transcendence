#!/bin/sh

#Recover node modules from parent directory
cp -r ../node_modules .

npx prisma generate
npx prisma db push --accept-data-loss
# npx prisma migrate dev # `prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.

if [ "$NODE_ENV" == "development" ]
then
	npx prisma db seed
	exec npm run start:dev
else
	rm -rf dist
	npm run build
	exec npm run start:prod
fi
