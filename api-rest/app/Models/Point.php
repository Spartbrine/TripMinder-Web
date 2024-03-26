<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_trip',
        'status',
        'arrival_time',
        'arrival_date',
        'km_arrival',
        'fuel_arrival',
        'longitude',
        'latitude',
        'address',
        'name'
    ];
    public function trip()
    {
        return $this->hasOne(Trip::class, 'id', 'id_trip');
    }
}
