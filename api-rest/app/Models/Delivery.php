<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_point',
        'description',
        'document',
        'date',
        'time',
        'receptionist'
    ];
    public function point()
    {
        return $this->hasOne(Point::class, 'id', 'id_point');
    }
}
