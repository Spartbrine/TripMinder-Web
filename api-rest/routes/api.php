<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Authenticate;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransportTypeController;
use App\Http\Controllers\VehicleController;
use App\Models\TransportType;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware(Authenticate::class)->resource('users', UserController::class);
Route::middleware(Authenticate::class)->resource('profiles', ProfileController::class);
Route::middleware(Authenticate::class)->resource('transporttypes', TransportTypeController::class);
Route::middleware(Authenticate::class)->resource('vehicles', VehicleController::class);

Route::put('users/profile/{id}', 'App\Http\Controllers\UserController@updateOnlyProfile');
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'App\Http\Controllers\AuthController@login');
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    Route::post('refresh', 'App\Http\Controllers\AuthController@refresh');
    Route::post('me', 'App\Http\Controllers\AuthController@me');
    Route::post('register', 'App\Http\Controllers\AuthController@register');
});
