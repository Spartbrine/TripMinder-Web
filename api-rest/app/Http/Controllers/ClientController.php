<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Validator;

class ClientController extends CatalogController
{
    public function clase() {
        return Client::class;
    }

    protected function makeRelationship(&$entity) {

    }

    protected function validator($input) {
        $validator = Validator::make($input, [
            'name' => 'required',
            'phone'=> 'required',
            'email'=> 'required',
            'website'=> 'required',
            'rfc'=> 'required'
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
    public function search(Request $request, $text)
    {
        $object = Client::where('name', 'LIKE', '%' . $text . '%')->paginate(1000000);

        return $this->sendResponse($object, 'OK');
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
            if (Client::where('name', $input['name'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
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
        $object = Client::find($id);
        $input = $request->getContent();
        if ($object == null) return $this->sendError('Object not found', ['The id is not found'], 404);
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);
        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        if (isset($input['name']) && $input['name'] !== '')
            if (Client::where('id', '!=', $id)->where('name', $input['name'])->first() != null) return $this->sendError('Validation error', 'Already exists the unit with this name', 409);
            $object->name = $input['name'];
        if (isset($input['phone']) && $input['phone'] !== '')
            $object->phone = $input['phone'];
        if (isset($input['email']) && $input['email'] !== '')
            $object->email = $input['email'];
        if (isset($input['website']) && $input['website'] !== '')
            $object->website = $input['website'];
        if (isset($input['rfc']) && $input['rfc'] !== '')
            $object->rfc = $input['rfc'];
        $answer = $object->save();


        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }

}
