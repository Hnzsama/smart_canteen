#!/bin/sh
set -e

# Default PORT 8080 jika $PORT tidak diset oleh Railway
export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Buat database.sqlite jika koneksi menggunakan sqlite
if [ "${DB_CONNECTION}" = "sqlite" ] || [ -z "${DB_CONNECTION}" ]; then
    mkdir -p /var/www/html/database
    touch /var/www/html/database/database.sqlite
    chown -R www-data:www-data /var/www/html/database
fi

# Set direktori storage/bootstrap cache
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache \
         /var/www/html/storage/logs \
         /var/www/html/storage/app/public

# Create storage link
echo "Creating storage link..."
php artisan storage:link --force || true

# Run optimization & caching
echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations & seeders
echo "Running database migrations & seeders..."
php artisan migrate --force --seed

# Fix ownership and permissions AFTER all artisan commands run as root
echo "Fixing storage & database permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Start Supervisor (PHP-FPM + Nginx)
echo "Starting server on port ${PORT}..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
