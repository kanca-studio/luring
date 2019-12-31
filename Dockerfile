FROM node:lts

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

ENV NODE_ENV production

COPY . .

EXPOSE 4000
CMD [ "yarn", "start" ]