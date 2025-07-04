<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecipesTable extends Migration
{
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('title');
            $table->text('description');
            $table->json('ingredients')->nullable();
            $table->json('steps')->nullable();  
            $table->string('time')->nullable();      
            $table->integer('servings')->nullable();
            $table->string('image_path')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('recipes');
    }
}