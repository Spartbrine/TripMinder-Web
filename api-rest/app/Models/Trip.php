<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_facility',
        'id_vehicle',
        'id_responsible',
        'date',
        'initial_mileage',
        'initial_fuel',
        'status',
        'final_mileage',
        'final_fuel',
        'name'
    ];
    public function facility()
    {
        return $this->hasOne(Facility::class, 'id', 'id_facility');
    }
    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'id', 'id_vehicle');
    }
    public function responsible()
    {
        return $this->hasOne(Responsible::class, 'id', 'id_responsible');
    }
}
