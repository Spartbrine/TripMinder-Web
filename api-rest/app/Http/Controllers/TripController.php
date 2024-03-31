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
            'final_fuel'=>'required'
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
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['type']) && $input['type'] !== '')
            if (Trip::where('id', '!=', $id)->where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->type = $input['type'];

        $answer = $object->save();

        if ($answer) {
            if ($object->id_facility > 0)
                $object->facility = Facility::find($input['id_facility']);
            return response()->json($object, 200);
        }
        if ($answer) {
            if ($object->id_vehicle > 0)
                $object->vehicle = Vehicle::find($input['id_vehicle']);
            return response()->json($object, 200);
        }
        if ($answer) {
            if ($object->id_responsible > 0)
                $object->responsible = Responsible::find($input['id_responsible']);
            return response()->json($object, 200);
        }
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
