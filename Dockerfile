FROM node:14.16.1 as builder
COPY . /app
RUN cd /app \
    && npm install \
    && npm run build
FROM nginx:1.19.10
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
