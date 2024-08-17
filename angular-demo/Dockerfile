FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

CMD /usr/src/app/node_modules/.bin/ng serve --host 0.0.0.0 --port 8080

EXPOSE 8080

