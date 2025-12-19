FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ==== Develop ====
FROM base AS dev

CMD VITE_PORT=${PORT} HOT_POLLING=true npm run dev

# ==== Build ====
FROM base AS build

RUN npm run build

# ==== Release ====
FROM nginx:stable-alpine AS release

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

CMD ["nginx", "-g", "daemon off;"]
