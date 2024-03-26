<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelTrip extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_vehicle',
        'id_trip',
        'id_fuel_type',
        'liters_filled',
        'initial_fuel',
        'price_per_liter',
        'total_fill',
        'fill_date'
    ];
    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'id', 'id_vehicle');
    }
    public function trip()
    {
        return $this->hasOne(Trip::class, 'id', 'id_trip');
    }
    public function fuelType()
    {
        return $this->hasOne(FuelType::class, 'id', 'id_fuel_type');
    }
}
