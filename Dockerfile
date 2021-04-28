FROM node:14.16.1-alpine
ENV PORT=3000
COPY . /app
WORKDIR /app
RUN npm install serve@11.3.2
EXPOSE $PORT
CMD ["npm", "run", "serve", "-p", "$PORT"]
