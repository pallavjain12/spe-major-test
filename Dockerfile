FROM node:16.14.2

RUN mkdir -p /app
 
WORKDIR /app
 #/usr/src/app
 
COPY package.json /app
 
RUN npm install

ENV docker=true
 
COPY . /app

EXPOSE 3000

ENTRYPOINT ["node"]

CMD ["app.js"]
