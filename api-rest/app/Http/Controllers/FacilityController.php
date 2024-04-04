<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Validator;

class FacilityController extends CatalogController
{
    public function clase() {
        return Facility::class;
    }

    protected function makeRelationship(&$entity) {

    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'name' => 'required',
            'phone'=> 'required',
            'longitude'=> 'required',
            'latitude'=> 'required',
            'locality'=> 'required',
            'postal_code'=> 'required',
            'address'=> 'required'
        ]);

        return $validator;
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
        $object = Facility::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['name']) && $input['name'] !== '')
            if (Facility::where('id', '!=', $id)->where('name', $input['name'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->name = $input['name'];
        if (isset($input['phone']) && $input['phone'] !== '')
        if (Facility::where('id', '!=', $id)->where('phone', $input['phone'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this phone', 409);
            $object->phone = $input['phone'];
        if (isset($input['longitude']) && $input['longitude'] !== '')
        if (Facility::where('id', '!=', $id)->where('longitude', $input['longitude'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this longitude', 409);
            $object->longitude = $input['longitude'];
        if (isset($input['latitude']) && $input['latitude'] !== '')
        if (Facility::where('id', '!=', $id)->where('latitude', $input['latitude'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this latitude', 409);
            $object->latitude = $input['latitude'];
        if (isset($input['locality']) && $input['locality'] !== '')
        if (Facility::where('id', '!=', $id)->where('locality', $input['locality'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this locality', 409);
            $object->locality = $input['locality'];
        if (isset($input['postal_code']) && $input['postal_code'] !== '')
        if (Facility::where('id', '!=', $id)->where('postal_code', $input['postal_code'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this postal code', 409);
            $object->postal_code = $input['postal_code'];
        if (isset($input['address']) && $input['address'] !== '')
        if (Facility::where('id', '!=', $id)->where('address', $input['address'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this address', 409);
            $object->address = $input['address'];

            $answer = $object->save();
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
