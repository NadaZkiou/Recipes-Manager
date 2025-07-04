<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Prevent duplicate favorites per user
            $table->unique(['user_id', 'recipe_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
    }
}
