FROM node:slim
RUN mkdir -p /usr/local/HelloBigzeroWorld/
COPY hello-bigzero-world.js package.json /usr/local/HelloBigzeroWorld/
WORKDIR /usr/local/HelloBigzeroWorld/
RUN npm install --production
EXPOSE 3000
ENTRYPOINT ["node", "hello-bigzero-world" ]
