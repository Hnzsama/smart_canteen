# Stage 1: Build Frontend Assets (Vite + React)
FROM node:20-alpine AS frontend
WORKDIR /app

# Install PHP & Extensions in Node container for Wayfinder plugin (php artisan wayfinder:generate)
RUN apk add --no-cache \
    php83 \
    php83-cli \
    php83-tokenizer \
    php83-ctype \
    php83-json \
    php83-mbstring \
    php83-openssl \
    php83-pdo \
    php83-fileinfo \
    php83-phar \
    php83-dom \
    php83-xml \
    php83-xmlwriter \
    php83-curl \
    && if [ -f /usr/bin/php83 ]; then ln -sf /usr/bin/php83 /usr/bin/php; fi

# Copy Composer binary
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install Composer dependencies needed by Artisan/Wayfinder
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files needed by Wayfinder & Vite build
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY artisan ./artisan
COPY resources ./resources
COPY vite.config.ts tsconfig.json components.json ./
COPY public ./public

# Generate autoloader so PHP artisan works
RUN composer dump-autoload --no-dev

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

# Install helper script for PHP extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP Extensions required by Laravel
RUN install-php-extensions \
    pdo_mysql \
    pdo_pgsql \
    bcmath \
    gd \
    zip \
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
