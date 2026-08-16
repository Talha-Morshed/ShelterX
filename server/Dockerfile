FROM node:18-alpine
WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

EXPOSE 5000
CMD ["sh", "-c", "node scripts/waitForDb.js && node server.js"]
