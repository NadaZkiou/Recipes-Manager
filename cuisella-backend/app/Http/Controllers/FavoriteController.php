<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        // Return each favorite record with its related recipe
        $favorites = $request->user()->favorites()->with('recipe')->get();
        return response()->json($favorites);
    }

    // 9) POST /api/favorites
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id'   => $request->user()->id,
            'recipe_id' => $request->recipe_id,
        ]);
        
        return response()->json($favorite->load('recipe'), 201);
    }
    public function destroy(Favorite $favorite)
    {
        if ($favorite->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $favorite->delete();
        return response()->json(['message' => 'Unfavorited']);
    }
}
