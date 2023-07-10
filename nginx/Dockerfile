FROM nginx:alpine
COPY launch.sh .
COPY nginx.conf .
COPY nginx.conf.dev .
EXPOSE 8080
CMD [ "./launch.sh" ]
