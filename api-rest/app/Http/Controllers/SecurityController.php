<?php

namespace App\Http\Controllers;

use App\Models\DetailedSale;
use App\Models\Element;
use App\Models\Grouper;
use App\Models\ProfileElement;
use App\Models\User;
use App\Models\UserElement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SecurityController extends Controller
{

    protected function makeRelationshipElement(&$entity)
    {
        $entity->grouper;
    }
    protected function makeRelationshipUserElement(&$entity)
    {
        $entity->user;
        $entity->element;
    }

    protected function validatorUserElement($input)
    {
        $validator = Validator::make($input, [
            'data' => 'required||array'
        ]);

        return $validator;
    }

    protected function orderbyindex($array)
    {
        $new_array = [];
        $found = array();

        for ($i = 0; $i < count($array); $i++) {

            $menor = 999999;
            $element_menor = $array[$i];

            for ($j = 0; $j < count($array); $j++) {

                $xd = in_array((string) $array[$j]->index, $found);
                
                if ($array[$j]->index < $menor && $xd==false) {
                    $menor = $array[$j]->index;
                    $element_menor = $array[$j];
                }
            }

            array_push($new_array, $element_menor);
            array_push($found, (string) $element_menor->index);
        }
        return $new_array;
    }


    /**
     * Get States
     */
    public function getElements(Request $request)
    {
        $filters = $request->all();

        if (array_key_exists('grouper', $filters) && $filters['grouper'] == true) {
            $groupers = Grouper::select('*')->get();
            foreach ($groupers as $grouper) {
                $grouper->elements = Element::where('id_grouper', $grouper->id)->get();
            }
            return $this->sendResponse($groupers, $filters);
        } else {
            $entities = Element::select('*')->get();
            if ($entities != NULL) {

                foreach ($entities as $entity) {

                    $this->makeRelationshipElement($entity);
                }
            }
            return $this->sendResponse($entities, 'OK');
        }
    }

    public function getUserElements(Request $request)
    {
        $filters = $request->all();
        $entities = UserElement::select('*');


       

        if (array_key_exists('id_user', $filters) && $filters['id_user'] > 0) {
            $entities = $entities->where('id_user', $filters['id_user']);
            

            if (array_key_exists('grouper', $filters) && $filters['grouper'] == true) {
                $entities = $entities->get();
                $groupers = Grouper::select('*')->get();
                $groupers_response = [];
                foreach ($groupers as $grouper) {
                    $elements = [];
                    
                    foreach ($entities as $entity) {
                        $element = Element::where('id', $entity->id_element)->where('id_grouper', $grouper->id)->first();
                        if ($element != NULL) {
                            array_push($elements, $element);
                        }
                    }

                    $grouper->elements = $this->orderbyindex($elements);

                    if (count($grouper->elements) > 0) {
                        array_push($groupers_response, $grouper);
                    }
                }
                return $this->sendResponse($groupers_response, $filters);
            }
        }




        // if ($entities != NULL) {
        //     foreach ($entities as $entity) {
        //         $this->makeRelationshipUserElement($entity);
        //     }
        // }

        

        return $this->sendResponse($entities->get(), 'OK');
    }

    public function getProfileElements(Request $request)
    {
        $filters = $request->all();
        $entities = ProfileElement::select('*');




        if (array_key_exists('id_profile', $filters) && $filters['id_profile'] > 0) {
            $entities = $entities->where('id_profile', $filters['id_profile']);


            if (array_key_exists('grouper', $filters) && $filters['grouper'] == true) {
                $entities = $entities->get();
                $groupers = Grouper::select('*')->get();
                $groupers_response = [];
                foreach ($groupers as $grouper) {
                    $elements = [];

                    foreach ($entities as $entity) {
                        $element = Element::where('id', $entity->id_element)->where('id_grouper', $grouper->id)->first();
                        if ($element != NULL) {
                            array_push($elements, $element);
                        }
                    }

                    $grouper->elements = $this->orderbyindex($elements);

                    if (count($grouper->elements) > 0) {
                        array_push($groupers_response, $grouper);
                    }
                }
                return $this->sendResponse($groupers_response, $filters);
            }
        }




        // if ($entities != NULL) {
        //     foreach ($entities as $entity) {
        //         $this->makeRelationshipUserElement($entity);
        //     }
        // }

        return $this->sendResponse($entities->get(), 'OK');
    }


    public function createUserElements(Request $request)
    {
        $input = $request->getContent();
        $input = json_decode($input, true);


        $input = (array) $input;
        $validator = $this->validatorUserElement($input);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            $data = $input['data'];
            $count = 0;
            $created = [];
            foreach ($data as $userElement) {

                if (array_key_exists('id_user', $userElement) && array_key_exists('id_element', $userElement)) {
                    $exist = UserElement::where('id_user', $userElement['id_user'])->where('id_element', $userElement['id_element'])->first();
                    $existUser = User::find($userElement['id_user']);
                    $existElement = Element::find($userElement['id_element']);

                    if ($exist === NULL && $existUser && $existElement) {
                        $entitie = new UserElement();
                        $entitie->id_user = $userElement['id_user'];
                        $entitie->id_element = $userElement['id_element'];
                        $response = $entitie->save();
                        if ($response) {
                            $count = $count + 1;
                            array_push($created, $entitie);
                        }
                    }
                }
            }
            if ($count > 0) {
                return $this->sendResponse($created, 'Have been created ' . $count . ' objects');
            }
            return $this->sendError('Store error', ['Any object created'], 500);
        }
    }

    public function destroyUserElements(Request $request)
    {
        $input = $request->getContent();
        $input = json_decode($input, true);
        $input = (array) $input;
        $validator = $this->validatorUserElement($input);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        } else {
            $data = $input['data'];
            $count = 0;
            $destroyed = [];
            foreach ($data as $userElement) {
                if (array_key_exists('id_user', $userElement) && array_key_exists('id_element', $userElement)) {
                    $exist = UserElement::where('id_user', $userElement['id_user'])->where('id_element', $userElement['id_element'])->first();
                    if ($exist !== NULL) {
                        $response = $exist->delete();
                        if ($response) {
                            $count = $count + 1;
                            array_push($destroyed, $exist);
                        }
                    }
                }
            }
            if ($count > 0) {
                return $this->sendResponse($destroyed, 'Have been deleted ' . $count . ' objects');
            }
            return $this->sendError('Delete error', ['Any object deleted'], 500);
        }
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
