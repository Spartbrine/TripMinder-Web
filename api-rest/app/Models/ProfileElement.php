<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileElement extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_profile',
        'id_element'
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class, 'id', 'id_profile');
    }
    public function element()
    {
        return $this->hasOne(Element::class, 'id', 'id_element');
    }
}