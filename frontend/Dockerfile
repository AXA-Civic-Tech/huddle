FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . ./
RUN npm run build
EXPOSE 4173
CMD [ "npm", "run", "preview" ]