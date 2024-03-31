<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Delivery;
use App\Models\Point;

class DeliveryController extends Controller
{
    public function clase() {
        return Delivery::class;
    }

    protected function makeRelationship(&$entity) {
        $entity->Point;
    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'id_point' =>'required|exists:points,id',
            'description'=>'required',
            'document'=>'required',
            'date'=>'required',
            'time'=>'required',
            'receptionist'=>'required'
        ]);

        return $validator;
    }
    public function search(Request $request, $text)
    {
        $Unit = Delivery::where('type', 'LIKE', '%' . $text . '%')->paginate(1000000);

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
            if (Delivery::where('receptionist', $input['receptionist'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
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
        $object = Delivery::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['type']) && $input['type'] !== '')
            if (Delivery::where('id', '!=', $id)->where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->type = $input['type'];

        $answer = $object->save();

        if ($answer) {
            if ($object->id_point > 0)
                $object->point = Point::find($input['id_point']);
            return response()->json($object, 200);
        }
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
