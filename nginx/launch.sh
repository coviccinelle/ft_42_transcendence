#!/bin/sh
if [ "$NODE_ENV" == "development" ]
then
	cp nginx.conf.dev /etc/nginx/nginx.conf
else
	cp nginx.conf /etc/nginx/nginx.conf
fi
nginx -g 'daemon off;'
