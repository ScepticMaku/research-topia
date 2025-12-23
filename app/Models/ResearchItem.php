<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResearchItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'user_id',
        'url_id',
        'note',
        'is_favorite'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function url() {
        return $this->belongsTo(Url::class);
    }

    public function tag() {
        return $this->hasMany(Tag::class);
    }
}
