# Stage 1: Build Frontend Assets (Vite + React)
FROM node:20-alpine AS frontend
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY vite.config.ts tsconfig.json components.json ./
COPY public ./public

# Ensure output goes to public/build
ENV BUILD_TARGET=local
RUN npm run build

# Stage 2: Production PHP Runtime
FROM php:8.3-fpm-alpine AS runner

# Install system dependencies (Nginx, Supervisor, gettext, zip, curl)
RUN apk add --no-cache \
    nginx \
    supervisor \
    gettext \
    curl \
    zip \
    unzip

# Install helper script for PHP extensions (fast & reliable)
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP Extensions required by Laravel
RUN install-php-extensions \
    pdo_mysql \
    pdo_pgsql \
    bcmath \
    gd \
    zip \
    opcache \
    intl \
    exif \
    pcntl

# Configure OPcache
RUN echo "[opcache]" > /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Copy Composer binary
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install Composer Dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy App Source Code
COPY . .

# Copy Built Assets from Frontend Stage
COPY --from=frontend /app/public/build ./public/build

# Autoload Optimization
RUN composer dump-autoload --optimize --no-dev

# Setup Docker Configurations
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
