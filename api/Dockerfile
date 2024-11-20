FROM node:18-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build-simple
RUN mkdir -p /usr/uploads
## this is stage two , where the app actually runs
FROM node:18-alpine
WORKDIR /usr
COPY package.json ./
## next package.json is for version
COPY package.json ../
RUN npm install --only=production
COPY --from=0 /usr/build .
COPY openapi.yaml .
COPY googlekey.json .
# create uploads folder
RUN mkdir -p /usr/uploads
RUN npm install pm2 -g

# Instalar curl
RUN apk add --no-cache curl

EXPOSE 8080
CMD ["npm", "run", "docker:start"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
