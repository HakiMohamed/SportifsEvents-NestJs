# Utilisation de l'image Node.js officielle comme base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du projet dans le conteneur
COPY . .

# Compiler le projet
RUN npm run build

# Exposer le port utilisé par l'application NestJS
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:dev"]
