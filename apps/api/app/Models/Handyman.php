<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Handyman extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'user_id', 'city_id', 'province_id',
        'name', 'slug', 'bio', 'phone', 'whatsapp',
        'photo_profile', 'address',
        'latitude', 'longitude',
        'is_verified', 'is_premium', 'is_active',
        'rating_avg', 'review_count',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_premium'  => 'boolean',
        'is_active'   => 'boolean',
        'latitude'    => 'decimal:7',
        'longitude'   => 'decimal:7',
        'rating_avg'  => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_handyman');
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class)->orderBy('order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }
}
