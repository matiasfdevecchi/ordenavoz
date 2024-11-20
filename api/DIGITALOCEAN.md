## Crear droplet en DigitalOcean

## Crear dominio
1. Ir a `create >  Domains/DNS`
2. Añadir el dominio
3. Entrar al dominio y crear los A DNS records necesarios (@ y www por ejemplo)

## Crear un usuario no root
Sigue los pasos de [este tutorial](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)

## Instala Nginx
Sigue los pasos de [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

`sudo nano /etc/nginx/sites-available/clients.ordenavoz.atcode.tech`

```
server {

        root /var/www/clients.ordenavoz.atcode.tech/html;
        index index.html index.htm index.nginx-debian.html;

        server_name clients.ordenavoz.atcode.tech www.clients.ordenavoz.atcode.tech;

        location / {
                proxy_pass http://localhost:25123;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```	

`sudo ln -s /etc/nginx/sites-available/clients.ordenavoz.atcode.tech /etc/nginx/sites-enabled/`

`sudo nginx -t`

`sudo systemctl restart nginx`

## Configura Let's Encrypt
Sigue los pasos de [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

`sudo certbot --nginx -d backoffice.ordenavoz.atcode.tech -d www.backoffice.ordenavoz.atcode.tech -d clients.ordenavoz.atcode.tech -d www.clients.ordenavoz.atcode.tech`

## Instala Docker
Sigue los pasos de [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)

## Correr el proyecto manualmente
1. Seguir los pasos de `Deployar Docker en Digital Ocean` del `README.md`

## Configurar las Github Actions

Sigue los pasos de [este tutorial](https://faun.pub/full-ci-cd-with-docker-github-actions-digitalocean-droplets-container-registry-db2938db8246)

### Crear el SSH KEY en usuario existente

> No usar RSA, usar ED25519 [Fuente](https://github.com/appleboy/ssh-action#setting-up-a-ssh-key) sino hay que habilitarlo y es un quilombo

`ssh-keygen -t ed25519 -a 200 -C "your_email@example.com"`

1. Crear una Clave SSH: Si aún no tienes una clave SSH, puedes crear una usando el comando `ssh-keygen` en tu terminal. Durante el proceso, te pedirá que ingreses una frase de contraseña (passphrase). Esta frase de contraseña es lo que usarás para la variable de entorno PASSPHRASE.

2. Obtener la Clave SSH: Una vez creada la clave, puedes encontrar el contenido de tu clave privada SSH (usualmente llamada id_rsa) en el directorio ~/.ssh/ de tu computadora. El contenido de este archivo es lo que usarás para la variable de entorno SSHKEY.

3. Agregar la Clave SSH al Usuario en DigitalOcean:

Primero, debes iniciar sesión en tu servidor Droplet via SSH.
Luego, cambia al usuario deve usando su - deve.
Después, puedes agregar la clave SSH al archivo authorized_keys del usuario deve. Puedes hacer esto copiando y pegando la clave pública (usualmente id_rsa.pub) en el archivo ~/.ssh/authorized_keys del usuario deve.

4. Habilitar RSA

Ejecutar `sudo nano /etc/ssh/sshd_config` y agregar al final `CASignatureAlgorithms +ssh-rsa`

### Extras

1. Crear un `Dockerfile` en el root del proyecto

```
FROM node:16-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build-simple
## this is stage two , where the app actually runs
FROM node:16-alpine
WORKDIR /usr
COPY package.json ./
## next package.json is for version
COPY package.json ../
RUN npm install --only=production
COPY --from=0 /usr/dist .
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime","index.js"]
```

2. Crear el archivo `.github/workflows/build-and-deploy.yml`:

```
name: Deploy

#1
on: 
  workflow_dispatch:

#2
env:
  REGISTRY: "registry.digitalocean.com/miutn"
  IMAGE_NAME: "mi-utn-backend"

#3
jobs:
  tags:
    name: Create tag
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@master

      - name: Extract version
        id: extract_version
        uses: Saionaro/extract-package-version@v1.2.1

      - name: Print version
        run: echo ${{ steps.extract_version.outputs.version }}

      - name: Create tag
        uses: rickstaa/action-create-tag@v1
        id: "tag_create"
        with:
          tag: ${{ steps.extract_version.outputs.version }}
          tag_exists_error: true
          message: ${{ format('release v{0}', steps.extract_version.outputs.version) }}

  build_and_push:
    runs-on: ubuntu-latest
    needs: tags
    steps:
      - name: Checkout the repo 
        uses: actions/checkout@v2

      - name: Extract version
        id: extract_version
        uses: Saionaro/extract-package-version@v1.2.1

      - name: Build container image
        run: docker build -t $(echo $REGISTRY)/$(echo $IMAGE_NAME):$(echo ${{ steps.extract_version.outputs.version }}) .

      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
    
      - name: Log in to DigitalOcean Container Registry with short-lived credentials
        run: doctl registry login --expiry-seconds 600
      
      - name: Remove all old images
        run: if [ ! -z "$(doctl registry repository list | grep "$(echo $IMAGE_NAME)")" ]; then doctl registry repository delete-manifest $(echo $IMAGE_NAME) $(doctl registry repository list-tags $(echo $IMAGE_NAME) | grep -o "sha.*") --force; else echo "No repository"; fi

      - name: Push image to DigitalOcean Container Registry
        run: docker push $(echo $REGISTRY)/$(echo $IMAGE_NAME):$(echo ${{ steps.extract_version.outputs.version }})
        
  deploy:
    runs-on: ubuntu-latest
    needs: build_and_push
    
    steps:
      - name: Checkout code
        uses: actions/checkout@master
        
      - name: Extract version
        id: extract_version
        uses: Saionaro/extract-package-version@v1.2.1

      - name: Deploy to Digital Ocean droplet via SSH action
        uses: appleboy/ssh-action@v0.1.3
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSHKEY }}
          passphrase: ${{ secrets.PASSPHRASE }}
          envs: IMAGE_NAME,REGISTRY,{{ secrets.DIGITALOCEAN_ACCESS_TOKEN }},GITHUB_SHA
          script: |
            # Login to registry
            docker login -u ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} -p ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} registry.digitalocean.com
            # Stop running container
            docker stop $(echo $IMAGE_NAME)
            # Remove old container
            docker rm $(echo $IMAGE_NAME)
            # Run a new container from a new image
            version=$(echo ${{ steps.extract_version.outputs.version }}) sh $(echo ${{ secrets.SH_PATH }})

      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
    
      - name: Log in to DigitalOcean Container Registry with short-lived credentials
        run: doctl registry login --expiry-seconds 600
      
      - name: Remove all old images
        run: if [ ! -z "$(doctl registry repository list | grep "$(echo $IMAGE_NAME)")" ]; then doctl registry repository delete-manifest $(echo $IMAGE_NAME) $(doctl registry repository list-tags $(echo $IMAGE_NAME) | grep -o "sha.*") --force; else echo "No repository"; fi
    
      - name: Start garbage collection
        run: doctl registry garbage-collection start --force
```

3. Insertar las siguientes variables en `secrets and variables/actions` del proyecto:
`DIGITALOCEAN_ACCESS_TOKEN`
`HOST`
`PASSPHRASE`
`SH_PATH`
`SSHKEY`
`USERNAME`

## Configurar app NodeJS con dominio

Seguir el paso 3 de [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04#step-3-setting-up-nginx-as-a-reverse-proxy-server)