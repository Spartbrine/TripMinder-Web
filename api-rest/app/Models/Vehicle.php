<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_transport_type',
        'economic_number',
        'num_license',
        'plates',
        'brand',
        'model',
        'year',
        'color',
        'insurance_carrier',
        'insurance_policy',
        'km_x_liter',
        'capacity'
    ];
    public function transportType()
    {
        return $this->hasOne(TransportType::class, 'id', 'id_transport_type');
    }
}
