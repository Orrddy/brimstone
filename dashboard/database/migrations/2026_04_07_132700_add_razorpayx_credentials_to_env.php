<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $credentials = [
            'RAZORPAYX_KEY_ID' => ['value' => 'rzp_test_xxxxxxxxxxx', 'encrypt' => true],
            'RAZORPAYX_KEY_SECRET' => ['value' => 'xxxxxxxxxxxxxxxxxxxxxxxx', 'encrypt' => true],
        ];

        foreach ($credentials as $key => $config) {
            $value = $config['encrypt'] ? encrypt($config['value']) : $config['value'];
            updateEnv($key, $value, false);
        }
    }

    public function down(): void
    {
        // Cannot reliably remove env vars
    }
};
