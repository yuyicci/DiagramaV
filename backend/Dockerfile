# Etapa 1: compilar TypeScript → JavaScript
FROM node:20-alpine AS build

WORKDIR /app

# Agregamos Python y compiladores para argon2
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: imagen final, liviana
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

# Instalamos compiladores temporalmente, instalamos dependencias y borramos los compiladores
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && npm ci --omit=dev \
    && apk del .build-deps

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]