<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'icon', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function handymen(): BelongsToMany
    {
        return $this->belongsToMany(Handyman::class, 'category_handyman');
    }
}
