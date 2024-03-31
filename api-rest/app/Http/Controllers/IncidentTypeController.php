<?php

namespace App\Http\Controllers;

use App\Models\IncidentType;
use Illuminate\Http\Request;
use Validator;
class IncidentTypeController extends CatalogController
{
    public function clase() {
        return IncidentType::class;
    }

    protected function makeRelationship(&$entity) {

    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'name' => 'required'
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
        $object = IncidentType::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['type']) && $input['type'] !== '')
            if (IncidentType::where('id', '!=', $id)->where('type', $input['type'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->type = $input['type'];

        $answer = $object->save();
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
