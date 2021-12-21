FROM node:16.13-alpine

RUN apk add --no-cache openssl
RUN apk add g++ make py3-pip

WORKDIR /usr/src/app
COPY . .

RUN npx yarn install
RUN npx yarn run build

EXPOSE 3000

CMD ["npx", "yarn", "run" ,"start"]
