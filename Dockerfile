FROM node:20

WORKDIR /app

COPY package*.json ./
COPY . .

RUN git submodule update --init
WORKDIR /app/src/shared
RUN npm install

WORKDIR /app
RUN npm install


RUN npm run build

CMD ["npm", "run", "start"]
