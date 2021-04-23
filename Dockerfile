FROM node:14.16.1-alpine
ENV PORT=3000
COPY . /app
WORKDIR /app
RUN npm install --production
EXPOSE $PORT
CMD ["npm", "run", "serve", "-p", "$PORT"]
