<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash};

class AuthController extends Controller
{
    public function register(Request $request)
    {
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return $this->respondWithToken($user, 'Registration successful', 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 422);
        }

        $user = Auth::user();
        $user->tokens()->delete(); 

        return $this->respondWithToken($user, 'Login successful');
    }

   public function logout(Request $request)
{
    try {
        $request->user()->currentAccessToken()->delete();
    
        Auth::guard('web')->logout();
        
        return response()->json(['message' => 'Successfully logged out']);
    } catch (\Exception $e) {
        \Log::error('Logout error: '.$e->getMessage());
        return response()->json([
            'message' => 'Logout failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    private function respondWithToken(User $user, $message, $status = 200)
    {
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'message' => $message
        ], $status);
    }
}