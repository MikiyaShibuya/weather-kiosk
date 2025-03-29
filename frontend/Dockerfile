FROM node:20-alpine AS base

COPY weather-kiosk /weather-kiosk

WORKDIR /weather-kiosk
RUN npm install

# ==== Develop ====
FROM base AS dev

CMD VITE_PORT=${PORT} HOT_POLLING=true npm run dev

# ==== Release ====
FROM base AS release

# TODO: This is temporal
CMD VITE_PORT=${PORT} npm run dev

# 
# CMD PORT=443 HTTPS=true SSL_CRT_FILE=/ssl-keys/fullchain.pem SSL_KEY_FILE=/ssl-keys/privkey.pem npm start
# 
# # Build and Release
# 
# FROM base AS build
# 
# RUN npm run build
# 
# FROM nginx:stable AS release
# 
# COPY static /usr/share/nginx/static
# COPY --from=build /react-app/build /usr/share/nginx/html
# COPY --from=build /react-app /app
# COPY --from=build /ssl-keys /ssl-keys
# COPY nginx.conf /etc/nginx/nginx.conf
# 
# CMD nginx -g 'daemon off;'
