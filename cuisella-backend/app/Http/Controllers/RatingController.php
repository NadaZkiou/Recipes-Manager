<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'rating' => 'required|integer|between:1,5'
        ]);

        $rating = Rating::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'recipe_id' => $validated['recipe_id']
            ],
            ['rating' => $validated['rating']]
        );

        $averageRating = $rating->recipe->averageRating();
        $ratingCount = $rating->recipe->ratingCount();

        return response()->json([
            'average_rating' => $averageRating,
            'rating_count' => $ratingCount
        ]);
    }
}