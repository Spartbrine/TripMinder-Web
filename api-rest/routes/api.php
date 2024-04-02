<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\FuelTripController;
use App\Http\Controllers\FuelTypeController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\IncidentTypeController;
use App\Http\Controllers\PointController;
use App\Http\Controllers\TripController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Authenticate;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransportTypeController;
use App\Http\Controllers\ResponsibleController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeliveryController;



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
Route::middleware(Authenticate::class)->get('users/search/{text}', 'App\Http\Controllers\UserController@search');


Route::middleware(Authenticate::class)->get('security/elements', 'App\Http\Controllers\SecurityController@getElements');
Route::middleware(Authenticate::class)->get('security/userelements', 'App\Http\Controllers\SecurityController@getUserElements');
Route::middleware(Authenticate::class)->post('security/userelements', 'App\Http\Controllers\SecurityController@createUserElements');
Route::middleware(Authenticate::class)->delete('security/userelements', 'App\Http\Controllers\SecurityController@destroyUserElements');
Route::middleware(Authenticate::class)->get('security/profilelements', 'App\Http\Controllers\SecurityController@getProfileElements');

Route::middleware(Authenticate::class)->resource('transporttypes', TransportTypeController::class);
Route::middleware(Authenticate::class)->resource('facilities', FacilityController::class);
Route::middleware(Authenticate::class)->resource('clients', ClientController::class);
Route::middleware(Authenticate::class)->resource('fueltypes', FuelTypeController::class);
Route::middleware(Authenticate::class)->resource('incidenttypes', IncidentTypeController::class);
Route::middleware(Authenticate::class)->resource('responsibles', ResponsibleController::class);
Route::middleware(Authenticate::class)->resource('companies', CompanyController::class);
Route::middleware(Authenticate::class)->resource('fueltrips', FuelTripController::class);
Route::middleware(Authenticate::class)->resource('vehicles', VehicleController::class);
Route::middleware(Authenticate::class)->resource('trips', TripController::class);
Route::middleware(Authenticate::class)->resource('incidents', IncidentController::class);
Route::middleware(Authenticate::class)->resource('locations', LocationController::class);
Route::middleware(Authenticate::class)->resource('points', PointController::class);
Route::middleware(Authenticate::class)->resource('deliveries', DeliveryController::class);
Route::middleware(Authenticate::class)->put('configuration/', 'App\Http\Controllers\ConfigurationSystemController@update');
Route::get('configuration', 'App\Http\Controllers\ConfigurationSystemController@get');




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
