FROM node:14.4-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app
COPY . .

RUN npx yarn install
RUN npx yarn run build

EXPOSE 3000

CMD ["npx", "yarn", "run" ,"start"]