<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = ['handyman_id', 'photo_url', 'caption', 'order'];

    public function handyman(): BelongsTo
    {
        return $this->belongsTo(Handyman::class);
    }
}
