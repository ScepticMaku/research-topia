<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    protected $fillable = [
        'title',
        'description',
        'url'
    ];

    public function researchItem() {
        return $this->hasMany(ResearchItem::class);
    }
}
