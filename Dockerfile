# Stage 1: Build Frontend Assets (Vite + React)
FROM php:8.4-cli AS frontend
WORKDIR /app

# Copy Node.js 20 & Composer binaries
COPY --from=node:20 /usr/local/bin/node /usr/local/bin/node
COPY --from=node:20 /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install system dependencies & PHP extensions needed by Composer & Wayfinder
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions zip intl

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

# Stage 2: Production PHP Runtime (Debian based for fast pre-compiled extensions)
FROM php:8.4-fpm AS runner

# Install system dependencies (Nginx, Supervisor, gettext)
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    gettext-base \
    curl \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install helper script for PHP extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP Extensions using pre-compiled debian packages (instant build)
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
