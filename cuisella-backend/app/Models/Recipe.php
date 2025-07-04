<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'ingredients',
        'steps',
        'time',
        'servings',
        'image_path',
        'tag',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'steps' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function averageRating(): float
    {
        return $this->ratings()->avg('rating') ?? 0;
    }

    public function ratingCount(): int
    {
        return $this->ratings()->count();
    }
}