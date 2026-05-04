<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    protected $fillable = ['province_id', 'name', 'type'];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function handymen(): HasMany
    {
        return $this->hasMany(Handyman::class);
    }
}
