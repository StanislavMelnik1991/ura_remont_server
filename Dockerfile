FROM node:20

WORKDIR /app

COPY package*.json ./
COPY . .

RUN git submodule update --init

RUN npm install


RUN npm run build

CMD ["npm", "run", "start"]
