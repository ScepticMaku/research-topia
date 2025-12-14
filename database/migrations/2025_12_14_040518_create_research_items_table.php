<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('research_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->default(1);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('url_id')->nullable()->constrained('urls')->onDelete('cascade');
            $table->string('note')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_items');
    }
};
