<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;
use App\Models\User;


class UserController extends CatalogController
{
    /**
     * Display a listing of the resource.
     */
    public function clase()
    {
        return User::class;
    }

    protected function makeRelationship(&$entity)
    {

        $entity->oProfile;
    }

    protected function validator($input)
    {
        $validator = Validator::make($input, [
            'name' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);

        return $validator;
    }

    public function search($text)
    {
        $users = User::where('name', 'LIKE', '%' . $text . '%')->paginate(1000000);

        return $this->sendResponse($users, 'OK');
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
            $input['password'] = bcrypt($input['password']);
            $obj = $this->clazz()::create($input);
            return $this->sendResponse([$obj], 'success');
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
        $user = User::find($id);
        // Esto hay que implementarlo
        // $input = $request->getContent();
        // $input = json_decode($input);
        $input = $request->all();
        if (isset($input['password'])) {
            $tmp_pass = bcrypt($input['password']);
            if (strcmp($user->password, $tmp_pass) !== 0) {
                $user->password = $tmp_pass;
            }
        }
        if (isset($input['name'])) {
            $user->name = $input['name'];
        }
        if (isset($input['email'])) {
            $user->email = $input['email'];
        }
        if (isset($input['status'])) {
            $user->status = $input['status'];
        }

        if (isset($input['profile'])) {

            $user->profile = $input['profile'];
        }
        $user->save();
        return response()->json($user, 200);
    }

    public function updateOnlyProfile(Request $request, $id)
    {
        //
        $user = User::find($id);
        $input = $request->all();

        if (isset($input['profile'])) {
            $user->profile = $input['profile'];
        }
        $user->save();
        return response()->json($user, 200);
    }

    public function destroy($id)
    {
        //
        $object = $this->clazz()::find($id);
        if ($object !== null) {
            $object->delete();

            return response()->json($object, 200);
        } else
            return $this->sendError('Not found', ['The object doesnt found']);
    }
}
