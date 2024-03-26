<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_trip',
        'id_incident_type',
        'description',
        'longitude',
        'latitude',
        'date'
    ];
    public function trip()
    {
        return $this->hasOne(Trip::class, 'id', 'id_trip');
    }
    public function incidentType()
    {
        return $this->hasOne(IncidentType::class, 'id', 'id_incident_type');
    }
}
