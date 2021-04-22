FROM node:14.16.1-alpine
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run clean
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]
