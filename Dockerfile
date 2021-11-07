FROM node:carbon
RUN mkdir -p /usr/local/dy-helloworld/
COPY dy-helloworld.js package.json /usr/local/dy-helloworld/
WORKDIR /usr/local/dy-helloworld/
RUN npm install --production
EXPOSE 3000
ENTRYPOINT ["node", "dy-helloworld" ]
