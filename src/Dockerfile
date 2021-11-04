FROM node:alpine

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./package*.json ./

RUN npm i 

COPY . . 

RUN npm run build

CMD ["npm","run","start"]