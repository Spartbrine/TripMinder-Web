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
    public function update(Request $request, $id)
    {
        //
    }
}
