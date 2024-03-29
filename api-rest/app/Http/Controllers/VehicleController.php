<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Vehicle;
Use App\Models\TransportType;
class VehicleController extends CatalogController
{
    public function clase()
    {
        return Vehicle::class;
    }

    protected function makeRelationship(&$entity)
    {
        $entity->transporttype;
    }

    protected function validator($input)
    {
        $validator = Validator::make($input, [
            'id_transport_type'=> 'required|exists:transport_types,id',
            'economic_number',
            'num_license'=> 'required|string',
            'plates'=> 'required|string',
            'brand'=> 'required|string',
            'model'=> 'required|string',
            'year'=> 'required',
            'color'=> 'required|string',
            'insurance_carrier'=> 'required|string',
            'insurance_policy'=> 'required|string',
            'km_x_liter'=> 'required|numeric|min:0',
            'capacity'=> 'required|numeric|min:0',
        ]);

        return $validator;
    }


    public function search($text)
    {
        $objets = Vehicle::where('plates', 'LIKE', '%' . $text . '%')->paginate(1000000);

        return $this->sendResponse($objets, 'OK');
    }

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
            if (Vehicle::where('plates', $input['plates'])->first() != null) return $this->sendError('Validation error', 'Already exists an agent with this name', 409);
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
        //
        $object = Vehicle::find($id);
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
        if (isset($input['plates']) && $input['plates'] !== '')
            if (Vehicle::where('id', '!=', $id)->where('plates', $input['plates'])->first() != null)
                return $this->sendError('Validation error', 'Already exists an vehicle with this name', 409);
                $object->plates = $input['plates'];
        if (isset($input['id_transport_type']) && $input['id_transport_type'] !== '')
            $object->id_transport_type = $input['id_transport_type'];
        if (isset($input['economic_number']) && $input['economic_number'] !== '')
            $object->economic_number = $input['economic_number'];
        if (isset($input['num_license']) && $input['num_license'] !== '')
            $object->num_license = $input['num_license'];
        if (isset($input['plates']) && $input['plates'] !== '')
            $object->plates = $input['plates'];
        if (isset($input['brand']) && $input['brand'] !== '')
            $object->brand = $input['brand'];
        if (isset($input['model']) && $input['model'] !== '')
            $object->model = $input['model'];
        if (isset($input['year']) && $input['year'] !== '')
            $object->year = $input['year'];
        if (isset($input['color']) && $input['color'] !== '')
            $object->color = $input['color'];
        if (isset($input['insurance_carrier']) && $input['insurance_carrier'] !== '')
            $object->insurance_carrier = $input['insurance_carrier'];
        if (isset($input['insurance_policy']) && $input['insurance_policy'] !== '')
            $object->insurance_policy = $input['insurance_policy'];
        if (isset($input['km_x_liter']) && $input['km_x_liter'] !== '')
            $object->km_x_liter = $input['km_x_liter'];
        if (isset($input['capacity']) && $input['capacity'] !== '')
            $object->capacity = $input['capacity'];

        $answer = $object->save();
        if ($answer) {
            if ($object->id_transport_type > 0)
                $object->transporttype = TransportType::find($input['id_transport_type']);
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }
}
