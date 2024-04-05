<?php

namespace App\Http\Controllers;
use App\Models\Facility;
use App\Models\Responsible;
use App\Models\Trip;
use App\Models\Vehicle;
use Validator;
use Illuminate\Http\Request;

class TripController extends CatalogController
{
    public function clase() {
        return Trip::class;
    }

    protected function makeRelationship(&$entity) {
        $entity->facility;
        $entity->vehicle;
        $entity->responsible;
    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'id_facility'=>'required|exists:facilities,id',
            'id_vehicle'=>'required|exists:vehicles,id',
            'id_responsible'=>'required|exists:responsibles,id',
            'date'=>'required',
            'initial_mileage'=>'required',
            'initial_fuel'=>'required',
            'status'=>'required',
            'final_mileage'=>'required',
            'final_fuel'=>'required',
            'name'=> 'required'
        ]);

        return $validator;
    }
    public function search(Request $request, $text)
    {
        $Unit = Trip::where('id', 'LIKE', '%' . $text . '%')->paginate(1000000);

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
        $object = Trip::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }
        $input = json_decode($input, true);

        $inputValidator = $input;

        $validator = $this->validator((array)$inputValidator);

        if ($validator->fails()) return $this->sendError('Validation Error.', $validator->errors());

        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['name']) && $input['name'] !== '')
            if (Trip::where('id', '!=', $id)->where('name', $input['name'])->first() != null)
                return $this->sendError('Validation error', 'Already exists an vehicle with this name', 409);
                $object->name = $input['name'];
        if (isset($input['id_facility']) && $input['id_facility'] !== '')
            $object->id_facility = $input['id_facility'];
        if (isset($input['id_vehicle']) && $input['id_vehicle'] !== '')
            $object->id_vehicle = $input['id_vehicle'];
        if (isset($input['id_responsible']) && $input['id_responsible'] !== '')
            $object->id_responsible = $input['id_responsible'];
        if (isset($input['date']) && $input['date'] !== '')
            $object->date = $input['date'];
        if (isset($input['initial_mileage']) && $input['initial_mileage'] !== '')
            $object->initial_mileage = $input['initial_mileage'];
        if (isset($input['initial_fuel']) && $input['initial_fuel'] !== '')
            $object->initial_fuel = $input['initial_fuel'];
        if (isset($input['status']) && $input['status'] !== '')
            $object->status = $input['status'];
        if (isset($input['final_mileage']) && $input['final_mileage'] !== '')
            $object->final_mileage = $input['final_mileage'];
        if (isset($input['final_fuel']) && $input['final_fuel'] !== '')
            $object->final_fuel = $input['final_fuel'];
        if (isset($input['name']) && $input['name'] !== '')
            $object->name = $input['name'];


        $answer = $object->save();
        if ($answer) {
            if ($object->id_facility > 0)
                $object->facility = Facility::find($input['id_facility']);
            if ($object->id_vehicle > 0)
                $object->vehicle = Vehicle::find($input['id_vehicle']);
            if ($object->id_responsible > 0)
                $object->responsible = Responsible::find($input['id_responsible']);
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
