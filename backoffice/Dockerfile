FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN NODE_ENV=development yarn install
COPY . .
ARG VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_AUTH0_NAMESPACE
ENV VITE_AUTH0_NAMESPACE=$VITE_AUTH0_NAMESPACE
RUN yarn build

## UP NGINX STAGE
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]