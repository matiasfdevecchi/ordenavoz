# Como levantar el ambiente local?
1. Instalar NodeJS 18
2. Instalar Docker
3. Ejecutar `docker run --name puertominero -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`
4. Ejecutar `npm install -g yarn`
5. Ejecutar `yarn install`
6. Setear en .env en base a la guía de .env.example
7. Ejecutar `yarn start:dev`

# API Tester

## Instalación

1. Instalar extensión de Chrome [Talend API Tester](https://chrome.google.com/webstore/detail/talend-api-tester-free-ed/aejoelaoggembcahagimdiliamlcdmfm)
2. Abrir la extensión en Chrome
3. Selecionar Import > Import API Tester Repository
4. Selecionar el archivo `api-tester.json` en la carpeta principal del proyecto
5. Marcar todo e importar

## Guardar un token de usuario
1. Registrarse o loguearse usando un endpoint dentro de `users`
2. Copiar el token obtenido
3. Abrir las variables de entorno de la extensión tocando el lapiz de arriba a la derecha
4. Reemplazar el valor de token por el valor copiado 

# Ayuda memoria para TypeORM

ONE TO MANY -> en el typeorm que tiene muchos del otro
MANY TO ONE -> en el typeorm que tiene uno del otro

## Correr S3 local
1. Entrar a la carpeta `local-stack`
2. Ejecutar `docker compose up`
3. Instalar `AWS CLI` desde [este link](https://docs.aws.amazon.com/es_es/cli/latest/userguide/getting-started-install.html)
4. Ejecutar `aws configure` e ingresar los siguientes valores
AWS Access Key ID [****************TWOG]: `anything`
AWS Secret Access Key [****************MZoH]: `anything`
Default region name [us-east-1]: `us-east-1`
Default output format [None]: `text`
5. Crear un bucket para productos con el siguiente comando. Si falla, chequear el numero del puerto del contenedor `aws s3api --endpoint-url=http://localhost:4566 create-bucket --bucket ordenavoz-space-local`
6. Setear CORS `aws s3api put-bucket-cors --bucket ordenavoz-space-local --endpoint-url=http://localhost:4566 --cors-configuration file://cors.json`
6. Listar buckets con el siguiente comando `aws s3api --endpoint-url=http://localhost:4566 list-buckets`
7. Ver archivos dentro del bucket `aws --endpoint-url=http://localhost:4566 s3 ls ordenavoz-space-local`
9. Para probarlo desde la API, usar Postman

# Deployar Docker en Digital Ocean

## Setear el la config de Container Registry
1. Descargar el archivo de docker credentials del portal de Digital Ocean
2. Copiar el archivo en `~/.docker/config.json` en el droplet
3. Crear el `env.list`
4. Crear el shell script `deploy.sh` con `$version` en la versión de docker
5. Ejecutar el sh: `version=0.0.1 sh deploy.sh`

## Buildear y subir docker image
1. `doctl registry login`
2. `docker build -t ordenavoz-api:0.0.1 .`
3. `docker tag ordenavoz-api:0.0.1 registry.digitalocean.com/miutn/ordenavoz-api:0.0.1`
4. `docker push registry.digitalocean.com/miutn/ordenavoz-api:0.0.1`

## Pullear y deployar en droplet
1. `docker --config ~/.docker pull registry.digitalocean.com/miutn/ordenavoz-api:0.0.1`
2. `docker run --name ordenavoz-api -d --restart=on-failure:3 -p 21318:8080 --env-file=/home/deve/ordenavoz/api/env.list registry.digitalocean.com/miutn/ordenavoz-api:0.0.1`