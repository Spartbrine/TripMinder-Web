<?php

namespace App\Http\Controllers;

use App\Models\Point;
use App\Models\Trip;
use Illuminate\Http\Request;
use Validator;
class PointController extends CatalogController
{
    public function clase()
    {
        return Point::class;
    }

    protected function makeRelationship(&$entity)
    {
        $entity->trip;
    }
    protected function validator($input)
    {
        $validator = Validator::make($input, [
            'id_trip'=>'required|exists:trips,id',
            'status'=>'required',
            'arrival_time'=>'required',
            'arrival_date'=>'required',
            'km_arrival'=>'required',
            'fuel_arrival'=>'required',
            'longitude'=>'required',
            'latitude'=>'required',
            'address'=>'required',
            'name'=>'required'



        ]);
        return $validator;
    }
    public function search(Request $request, $text)
    {
        $Unit = Point::where('type', 'LIKE', '%' . $text . '%')->paginate(1000000);

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
            if (Point::where('address', $input['address'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
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
        $object = Point::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['type']) && $input['type'] !== '')
            if (Point::where('id', '!=', $id)->where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->type = $input['type'];

        $answer = $object->save();
        if ($answer) {
            if ($object->id_trip > 0)
                $object->trip = Trip::find($input['id_trip']);
            return response()->json($object, 200);
        }
        if($answer)
        {
            return response()->json($object,200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
