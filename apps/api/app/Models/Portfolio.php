<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = ['handyman_id', 'title', 'description', 'order'];

    public function handyman(): BelongsTo
    {
        return $this->belongsTo(Handyman::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('order');
    }

    public function thumbnail(): HasOne
    {
        return $this->hasOne(PortfolioImage::class)->where('is_thumbnail', true);
    }
}
