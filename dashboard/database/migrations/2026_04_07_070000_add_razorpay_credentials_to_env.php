<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $razorpay = [
            'RAZORPAY_KEY_ID' => ['value' => 'rzp_test_xxxxxxxxxxx', 'encrypt' => true],
            'RAZORPAY_KEY_SECRET' => ['value' => 'xxxxxxxxxxxxxxxxxxxxxxxx', 'encrypt' => true],
            'RAZORPAY_DEFAULT_CURRENCY' => ['value' => 'INR', 'encrypt' => false],
            'RAZORPAYX_ACCOUNT_NUMBER' => ['value' => '8494049049049', 'encrypt' => true],
        ];

        foreach ($razorpay as $key => $data) {
            updateEnv($key, $data['value'], $data['encrypt']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
