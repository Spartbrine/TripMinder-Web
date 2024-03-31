<?php

namespace App\Http\Controllers;
use App\Models\FuelTrip;
use Validator;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\FuelType;
use App\Models\Trip;


class FuelTripController extends CatalogController
{
    public function clase() {
        return FuelTrip::class;
    }

    protected function makeRelationship(&$entity) {
        $entity->vehicle;
        $entity->fueltype;
        $entity->trip;
    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'id_vehicle'=>'required|exists:vehicles,id',
            'id_trip'=>'required|exists:trips, id',
            'id_fuel_type'=>'required|exists:fuel_types, id',
            'liters_filled'=>'required',
            'initial_fuel'=>'required',
            'price_per_liter'=>'required',
            'total_fill'=>'required',
            'fill_date'=>'required'
        ]);

        return $validator;
    }
    public function search(Request $request, $text)
    {
        $Unit = FuelTripController::where('type', 'LIKE', '%' . $text . '%')->paginate(1000000);

        return $this->sendResponse($Unit, 'OK');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        // $input = $request->all();
        $input = $request->getContent();
        $input = json_decode($input);
        $input = (array) $input;
        $validator = $this->validator($input);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            if (FuelTripController::where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $obj = $this->clase()::create($input);
            return response()->json($obj, 200);
        }
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $object = FuelTripController::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['type']) && $input['type'] !== '')
            if (FuelTripController::where('id', '!=', $id)->where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->type = $input['type'];

        $answer = $object->save();

        if ($answer) {
            if ($object->id_vehicle > 0)
                $object->vehicle = Vehicle::find($input['id_vehicle']);
            return response()->json($object, 200);
        }
        if ($answer) {
            if ($object->id_trip > 0)
                $object->trip = Trip::find($input['id_trip']);
            return response()->json($object, 200);
        }
        if ($answer) {
            if ($object->id_fuel_type > 0)
                $object->fueltype = FuelType::find($input['id_fuel_type']);
            return response()->json($object, 200);
        }
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
