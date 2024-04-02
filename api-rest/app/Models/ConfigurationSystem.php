<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigurationSystem extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'direction',
        'phone',
        'primary_color',
        'progress_color',
        'btnlogin_color',
        'color_table',
        'image_login',
        'image_headerlogo',
        'image_sidebarlogo',
        'image_bannerlogin',
        'image_report'
    ];
}
