<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    // Fields we can mass-assign
    protected $fillable = [
        'user_id',
        'recipe_id',
    ];

    // Favorite belongs to one User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Favorite belongs to one Recipe
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
