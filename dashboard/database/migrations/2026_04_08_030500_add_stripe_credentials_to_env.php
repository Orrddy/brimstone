<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $credentials = [
            'STRIPE_KEY' => ['value' => 'stripe_key_placeholder', 'encrypt' => true],
            'STRIPE_SECRET' => ['value' => 'stripe_secret_placeholder', 'encrypt' => true],
            'STRIPE_WEBHOOK_SECRET' => ['value' => 'stripe_webhook_secret_placeholder', 'encrypt' => true],
            'STRIPE_DEFAULT_CURRENCY' => ['value' => 'usd', 'encrypt' => false],
        ];

        foreach ($credentials as $key => $config) {
            updateEnv($key, $config['value'], $config['encrypt']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Environment variables are not easily rolled back via migrations
    }
};
