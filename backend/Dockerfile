FROM node:22-alpine

WORKDIR /usr/src/app

# Copia package e lock primeiro para cache
COPY package*.json ./

RUN npm install

# Copia código
COPY . .

# Build TS -> JS
RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "dev"]