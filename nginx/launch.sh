#!/bin/sh
if [ "$NODE_ENV" == "development" ]
then
	cp nginx-dev.conf /etc/nginx/nginx.conf
else
	cp nginx.conf /etc/nginx/nginx.conf
fi
exec nginx -g 'daemon off;'
