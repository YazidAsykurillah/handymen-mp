<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Handyman;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends ApiController
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'whatsapp' => 'required|string|max:20|unique:users,phone',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->whatsapp,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('user');

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 'Registration successful.', 201);
    }

    /**
     * Register a new handyman.
     */
    public function registerHandyman(Request $request): JsonResponse
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|email|max:255|unique:users',
            'whatsapp'    => 'required|string|max:20|unique:users,phone',
            'password'    => ['required', 'confirmed', Password::defaults()],
            'province_id' => 'required|exists:provinces,id',
            'city_id'     => 'required|exists:cities,id',
            'categories'  => 'required|array',
            'categories.*'=> 'exists:categories,id',
            'bio'         => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->whatsapp,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('handyman');

            $handyman = Handyman::create([
                'user_id'     => $user->id,
                'name'        => $request->name,
                'slug'        => Str::slug($request->name) . '-' . Str::random(5),
                'province_id' => $request->province_id,
                'city_id'     => $request->city_id,
                'bio'         => $request->bio,
                'phone'       => $request->whatsapp,
                'whatsapp'    => $request->whatsapp,
                'is_verified' => false,
                'is_premium'  => false,
                'is_active'   => true,
            ]);

            $handyman->categories()->attach($request->categories);

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success([
                'user'     => new UserResource($user),
                'handyman' => [
                    'id'          => $handyman->id,
                    'slug'        => $handyman->slug,
                    'is_verified' => $handyman->is_verified,
                    'is_premium'  => $handyman->is_premium,
                ],
                'token'    => $token,
            ], 'Handyman registration successful. Your profile is pending verification.', 201);
        });
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('The provided credentials are incorrect.', 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 'Login successful.');
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'whatsapp' => 'sometimes|string|max:20',
        ]);

        if ($request->has('whatsapp')) {
            $user->phone = $request->whatsapp;
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        $user->save();

        return $this->success(new UserResource($user), 'Profile updated successfully.');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|current_password',
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return $this->success(null, 'Password updated successfully.');
    }
}
