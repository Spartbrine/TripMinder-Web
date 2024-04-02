<?php

namespace App\Http\Controllers;


use App\Models\ConfigurationSystem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ConfigurationSystemController extends Controller
{

    protected function validator($input)
    {
        $validator = Validator::make($input, [
            'name' => 'string|max:100',
            'direction' => 'string|max:255',
            'phone' => 'string|min:10|max:10',
            'primary_color' => 'regex:/^#[a-fA-F0-9]{6}$/',
            'progress_color' => 'regex:/^#[a-fA-F0-9]{6}$/',
            'btnlogin_color' => 'regex:/^#[a-fA-F0-9]{6}$/',
            'color_table' => 'regex:/^#[a-fA-F0-9]{6}$/',
            'image_login' => 'regex:/^data:image\/[a-zA-Z]+;base64,[\w\/\+=]+$/',
            'image_headerlogo' => 'regex:/^data:image\/[a-zA-Z]+;base64,[\w\/\+=]+$/',
            'image_sidebarlogo' => 'regex:/^data:image\/[a-zA-Z]+;base64,[\w\/\+=]+$/',
            'image_bannerlogin' => 'regex:/^data:image\/[a-zA-Z]+;base64,[\w\/\+=]+$/',
            'image_report' => 'regex:/^data:image\/[a-zA-Z]+;base64,[\w\/\+=]+$/'

        ]);

        return $validator;
    }


    public function get()
    {
        $configuration = ConfigurationSystem::first();
        return $this->sendResponse($configuration, 'Ok');
    }

    public function update(Request $request)
    {
        //
        $object = ConfigurationSystem::first();
        $input = $request->getContent();
        if ($input == null) {
            return $this->sendError('JSON Invalid', ['Input needed'], 406);
        }

        $input = json_decode($input, true);

        $inputValidator = $input;
        $validator = $this->validator((array)$inputValidator);

        if ($validator->fails()) return $this->sendError('Validation Error.', $validator->errors());

        if (json_last_error() !== 0)
            return $this->sendError('JSON Invalid', ['Malformed JSON'], 406);
        // if (isset($input['id_agent']) && $input['id_agent'] !== '')
        //     $object->id_agent = $input['id_agent'];
        if (isset($input['name']) && $input['name'] !== '')
            $object->name = $input['name'];
        if (isset($input['direction']) && $input['direction'] !== '')
            $object->direction = $input['direction'];
        if (isset($input['phone']) && $input['phone'] !== '')
            $object->phone = $input['phone'];
        if (isset($input['primary_color']) && $input['primary_color'] !== '')
            $object->primary_color = $input['primary_color'];
        if (isset($input['progress_color']) && $input['progress_color'] !== '')
            $object->progress_color = $input['progress_color'];
        if (isset($input['btnlogin_color']) && $input['btnlogin_color'] !== '')
            $object->btnlogin_color = $input['btnlogin_color'];
        if (isset($input['color_table']) && $input['color_table'] !== '')
            $object->color_table = $input['color_table'];
        if (isset($input['image_login']) && $input['image_login'] !== '')
            $object->image_login = $input['image_login'];
        if (isset($input['image_headerlogo']) && $input['image_headerlogo'] !== '')
            $object->image_headerlogo = $input['image_headerlogo'];
        if (isset($input['image_sidebarlogo']) && $input['image_sidebarlogo'] !== '')
            $object->image_sidebarlogo = $input['image_sidebarlogo'];
        if (isset($input['image_bannerlogin']) && $input['image_bannerlogin'] !== '')
            $object->image_bannerlogin = $input['image_bannerlogin'];
        if (isset($input['image_report']) && $input['image_report'] !== '')
            $object->image_report = $input['image_report'];
        $answer = $object->save();
        if ($answer) {
            return response()->json($object, 200);
        }
        return $this->sendError('Update error', ['The object update is not valid'], 500);
    }

    public function sendResponse($result, $message)
    {
        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];


        return response()->json($response, 200);
    }

    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];


        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }
}
