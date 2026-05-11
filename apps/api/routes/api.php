<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ReferenceDataController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\HandymanController;
use App\Http\Controllers\Api\HandymanProfileController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\LocationSearchController;

Route::get('/ping', fn() => response()->json(['status' => 'ok', 'app' => 'Handyman API']));

// Public Handymen
Route::get('/handymen', [HandymanController::class, 'index']);
Route::get('/handymen/{slug}', [HandymanController::class, 'show']);
Route::get('/handymen/{slug}/reviews', [HandymanController::class, 'reviews']);
Route::get('/handymen/{slug}/portfolios', [HandymanController::class, 'portfolios']);
Route::get('/portfolios', [PortfolioController::class, 'publicIndex']);

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/handyman', [AuthController::class, 'registerHandyman']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
});

// Handyman Management
Route::middleware(['auth:sanctum', 'role:handyman'])->prefix('handyman')->group(function () {
    Route::get('/profile', [HandymanProfileController::class, 'show']);
    Route::put('/profile', [HandymanProfileController::class, 'update']);
    Route::post('/profile/photo', [HandymanProfileController::class, 'uploadPhoto']);
    Route::delete('/profile/photo', [HandymanProfileController::class, 'deletePhoto']);
    Route::put('/categories', [HandymanProfileController::class, 'syncCategories']);

    Route::prefix('portfolios')->group(function () {
        Route::get('/', [PortfolioController::class, 'index']);
        Route::post('/', [PortfolioController::class, 'store']);
        Route::put('/{id}', [PortfolioController::class, 'update']);
        Route::delete('/{id}', [PortfolioController::class, 'destroy']);
        Route::put('/reorder', [PortfolioController::class, 'reorder']);
        
        // Image management
        Route::post('/{id}/images', [PortfolioController::class, 'addImages']);
        Route::patch('/images/{imageId}/thumbnail', [PortfolioController::class, 'setThumbnail']);
        Route::delete('/images/{imageId}', [PortfolioController::class, 'deleteImage']);
    });
});

// Reference Data
Route::get('/categories', [ReferenceDataController::class, 'categories']);
Route::get('/provinces', [ReferenceDataController::class, 'provinces']);
Route::get('/cities', [ReferenceDataController::class, 'cities']);
Route::get('/districts', [ReferenceDataController::class, 'districts']);
Route::get('/locations/search', [LocationSearchController::class, 'search']);

// User & Reviews (Protected)
Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    Route::post('/handymen/{slug}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('/user/reviews', [ReviewController::class, 'userReviews']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
