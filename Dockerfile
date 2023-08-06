FROM node

WORKDIR /rest-api-app

COPY . /rest-api-app/

RUN npm i

EXPOSE 8999

CMD [ "cross-env", "NODE_ENV=production", "node ./server.js" ]
