<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserElement extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_user',
        'id_element'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'id_user');
    }
    public function element()
    {
        return $this->hasOne(Element::class, 'id', 'id_element');
    }
}