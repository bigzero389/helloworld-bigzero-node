#FROM node:slim
FROM 160270626841.dkr.ecr.ap-northeast-2.amazonaws.com/base/node:slim
RUN mkdir -p /usr/local/HelloBigzeroWorld/
COPY hello-bigzero-world.js package.json /usr/local/HelloBigzeroWorld/
WORKDIR /usr/local/HelloBigzeroWorld/
RUN npm install --production
EXPOSE 3000
ENV HELLOWORLD_VERSION 1.0
ENTRYPOINT ["node", "hello-bigzero-world" ]
