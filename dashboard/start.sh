#!/bin/sh
set -e

echo "==> Starting BrimStone Dashboard..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "==> Generating application key..."
    php artisan key:generate --force
fi

# Cache configuration
echo "==> Caching configuration..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations
echo "==> Running database migrations..."
php artisan migrate --force || echo "WARNING: Migrations failed - check DB connection"

# Create storage link if it doesn't exist
php artisan storage:link --force 2>/dev/null || true

# Set correct permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create supervisor log directory
mkdir -p /var/log/supervisor

echo "==> BrimStone Dashboard is starting on port 10000"

# Start supervisord (manages both php-fpm and nginx)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
