<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class RecipeController extends Controller
{
   public function index()
    {
        $paginated = Recipe::with(['user', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->latest()
            ->paginate(9);

        // Add user's rating if authenticated
        if (auth()->check()) {
            $paginated->getCollection()->transform(function ($recipe) {
                $userRating = $recipe->ratings()
                    ->where('user_id', auth()->id())
                    ->first();
                
                $recipe->user_rating = $userRating ? $userRating->rating : 0;
                return $recipe;
            });
        }

        return response()->json($paginated);
    }

    public function popular()
    {
        $recipes = Recipe::with(['user', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->latest()
            ->limit(6)
            ->get();

        // Add user's rating if authenticated
        if (auth()->check()) {
            $recipes->each(function ($recipe) {
                $userRating = $recipe->ratings()
                    ->where('user_id', auth()->id())
                    ->first();
                
                $recipe->user_rating = $userRating ? $userRating->rating : 0;
            });
        }

        return response()->json($recipes);
    }

    public function show($id)
    {
        $recipe = Recipe::with(['user', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->findOrFail($id);

        // Add user's rating if authenticated
        if (auth()->check()) {
            $userRating = $recipe->ratings()
                ->where('user_id', auth()->id())
                ->first();
            
            $recipe->user_rating = $userRating ? $userRating->rating : 0;
        }

        return response()->json($recipe);
    }

    public function userRecipes(Request $request)
    {
        $recipes = $request->user()
            ->recipes()
            ->with(['user', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->latest()
            ->get();

        // Add user's rating
        $recipes->each(function ($recipe) use ($request) {
            $userRating = $recipe->ratings()
                ->where('user_id', $request->user()->id)
                ->first();
            
            $recipe->user_rating = $userRating ? $userRating->rating : 0;
        });

        return response()->json($recipes);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'time'        => 'nullable|string|max:100',
            'servings'    => 'nullable|integer',
            'ingredients' => 'required|json',
            'steps'       => 'required|json',
            'image'       => 'nullable|image|max:2048',
            'tag'         => 'nullable|string|max:100',
        ]);

        // Convert JSON strings to arrays
        $data['ingredients'] = json_decode($data['ingredients'], true);
        $data['steps'] = json_decode($data['steps'], true);
        
        $data['user_id'] = $request->user()->id;
        
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('recipe-images', 'public');
        }

        $recipe = Recipe::create($data);
        return response()->json($recipe, 201);
        
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'time'        => 'nullable|string|max:100',
            'servings'    => 'nullable|integer',
            'ingredients' => 'required|json',
            'steps'       => 'required|json',
            'image'       => 'nullable|image|max:2048',
            'tag'         => 'nullable|string|max:100',
        ]);

        // Convert JSON strings to arrays
        $data['ingredients'] = json_decode($data['ingredients'], true);
        $data['steps'] = json_decode($data['steps'], true);

        if ($request->hasFile('image')) {
            if ($recipe->image_path) {
                Storage::disk('public')->delete($recipe->image_path);
            }
            $data['image_path'] = $request->file('image')->store('recipe-images', 'public');
        }

        $recipe->update($data);
        return response()->json($recipe);
    }

    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted']);
    }
    public function search(Request $request)
{
    $search = $request->query('q');

    $query = Recipe::with('user');

    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('tag', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhereHas('user', function ($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              });
        });
    }

    return $query->latest()->paginate(9);
}

}