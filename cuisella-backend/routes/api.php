<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\FavoriteController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/popular', [RecipeController::class, 'popular']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{id}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroy']);
    Route::get('/user/recipes', [RecipeController::class, 'userRecipes']);
    Route::get('/user/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
      Route::post('/ratings', [RatingController::class, 'store']);
    
});