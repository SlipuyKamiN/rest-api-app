FROM node

WORKDIR /rest-api-app

COPY . .

RUN npm install

EXPOSE 8999

CMD [ "npx", "cross-env", "NODE_ENV=production", "node ./server.js" ]
