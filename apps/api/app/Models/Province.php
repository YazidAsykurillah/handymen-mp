<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Province extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = ['id', 'name'];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function handymen(): HasMany
    {
        return $this->hasMany(Handyman::class);
    }
}
