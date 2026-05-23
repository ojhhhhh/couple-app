FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js api.js sw.js manifest.json ./
COPY icon-192.png icon-512.png ./
COPY 情侣空间.html ./
COPY *.png ./
COPY css/ css/
COPY js/ js/
RUN mkdir -p server-data
EXPOSE 3456
CMD ["node", "server.js"]
