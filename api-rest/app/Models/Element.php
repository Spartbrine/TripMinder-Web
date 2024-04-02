<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_grouper',
        'name',
        'url',
        'icon',
        
    ];

    public function grouper()
    {
        return $this->hasOne(Grouper::class, 'id', 'id_grouper');
    }
}