FROM node:22-alpine

WORKDIR /usr/src/app

# Instalar Prisma CLI globalmente (opcional, mas útil)
RUN npm install -g prisma

# Copia package e lock primeiro para cache
COPY package*.json ./

# Copia schema do Prisma ANTES do npm install (para o postinstall funcionar)
COPY prisma ./prisma

RUN npm install




# Copia script de entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Copia resto do código
COPY . .

# Gerar Prisma Client e fazer build do TypeScript
RUN npx prisma generate && npm run build

EXPOSE 3333

# Usar entrypoint para gerar Prisma Client no container
# Usar sh para garantir que funcione mesmo se o arquivo não tiver permissão de execução
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
# Usar start para produção (executa dist/server.js)
CMD ["npm", "start"]