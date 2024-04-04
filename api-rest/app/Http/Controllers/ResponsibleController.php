<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Responsible;

class ResponsibleController extends CatalogController
{
    public function clase() {
        return Responsible::class;
    }

    protected function makeRelationship(&$entity) {
    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'name' => 'required',
            'license_number'=> 'required',
            'phone'=> 'required',
            'address'=> 'required',
            'photo'=> 'required'
        ]);

        return $validator;
    }
    public function search(Request $request, $text)
    {
        $Unit = Responsible::where('name', 'LIKE', '%' . $text . '%')->paginate(1000000);

        return $this->sendResponse($Unit, 'OK');
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
        $object = Responsible::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['name']) && $input['name'] !== '')
            if (Responsible::where('id', '!=', $id)->where('name', $input['name'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->name = $input['name'];
        if (isset($input['license_number']) && $input['license_number'] !== '')
            $object->license_number = $input['license_number'];
        if (isset($input['phone']) && $input['phone'] !== '')
            $object->phone = $input['phone'];
        if (isset($input['address']) && $input['address'] !== '')
            $object->address = $input['address'];
        if (isset($input['photo']) && $input['photo'] !== '')
            $object->photo = $input['photo'];
        $answer = $object->save();
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
