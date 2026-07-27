# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_PROXY_TARGET
ARG VITE_EXTENSION_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_REDIRECT_URI
ARG VITE_BACKEND_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PROXY_TARGET=$VITE_PROXY_TARGET
ENV VITE_EXTENSION_URL=$VITE_EXTENSION_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_REDIRECT_URI=$VITE_GOOGLE_REDIRECT_URI
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2) Runtime stage
FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
