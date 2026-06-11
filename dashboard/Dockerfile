# BrimStone Brokers — Laravel Dashboard
# PHP 8.3 + Nginx for Render.com deployment

FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    gmp-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    openssl-dev \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        gmp \
        pdo \
        pdo_mysql \
        mbstring \
        xml \
        bcmath \
        intl \
        tokenizer \
        opcache

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies (production only)
RUN composer install \
    --no-interaction \
    --optimize-autoloader \
    --no-scripts \
    --prefer-dist

# Copy application files
COPY . .

# Copy package.json and install node dependencies for asset compilation
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Build assets if vite config exists
RUN if [ -f vite.config.js ]; then npm run build; fi

# Run post-install composer scripts now
RUN composer run-script post-autoload-dump

# Set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Render uses port 10000 by default
EXPOSE 10000

CMD ["/start.sh"]
