<?php
namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;

abstract class CatalogController extends Controller {

    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public abstract function clase();

    protected abstract function makeRelationship(&$entity);

    protected abstract function validator($entity);
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(Request $request)
    {
        //
        $expr = "/(\*?)([A-Za-z0-9_]+)\^(.*)~(.*)/";
        ;
        $filters = $request->all();
        $seasons = $this->clase()::select('*');
        $limit = 25;
        $order_type = 'ASC';
        $order_column = 'id';
        $rel = false;
        if (isset($filters)&&count($filters)>0) {

            if (array_key_exists('limit', $filters)) {
                $limit = $filters['limit'];
                unset( $filters['limit'] );
            }
            if (array_key_exists('range', $filters)) {
                $range = $filters['range'];
                unset( $filters['range']);
            }
            if (array_key_exists('rel', $filters)) {
                $rel = $filters['rel'];
                unset( $filters['rel'] );
            }

            if(array_key_exists('orderBy', $filters)) {
                $orderFilter = $filters['orderBy'];

                if($orderFilter[0] == '-'){
                    $order_type = 'DESC';
                }
                else if($orderFilter[0] == '~'){
                    $order_type = 'ASC';
                }

                $order_column = substr($orderFilter, 1);

                unset( $filters['orderBy']);
            }

            if (isset($filters['page'])) {
                // $entities = $this->clase()::paginate($limit)->appends($filters);
                // if ($entities!=NULL) {
                //     foreach($entities as $entity) {
                //         $this->makeRelationship($entity);
                //      }
                // }

                // return $this->sendResponse($entities, $filters);
            }

            if (isset($range) && preg_match($expr, $range, $matches)) {
                $asterik = $matches[1];
                $field = $matches[2];
                $start = $matches[3];
                $end = $matches[4];
                if (empty($asterik)) {
                    $seasons->where($field,'>=',$start)->where($field,'<=',$end);
                } else {
                    $seasons->where($field,'>',$start)->where($field,'<',$end);
                }
            }
            foreach($filters as $key=>$filter) {
                if($key != 'id_agent_saleCanceled'&&$key!=='name'&&$key!=='typelike'&&$key!=='street'&&$key!=='sumary'&&$key!=='page'){
                    $seasons = $seasons->where($key, $filter);
                }
                if($key=='name'){
                    $seasons = $seasons->where('name', 'LIKE', '%'.$filter.'%');
                }
                if($key=='sumary'){
                    $seasons = $seasons->where('sumary', 'LIKE', '%'.$filter.'%');
                }
                if($key=='typelike'){
                    $seasons = $seasons->where('type', 'LIKE', '%'.$filter.'%');
                }
                if($key=='street'){
                    $seasons = $seasons->where('street', 'LIKE', '%'.$filter.'%');
                }
            }

            $entities = $seasons->orderBy($order_column, $order_type)->paginate($limit)->appends($filters);

            if ($entities!=NULL) {
                foreach($entities as $entity) {
                    $this->makeRelationship($entity);
                }
            }
            return $this->sendResponse($entities, $filters);
        } else {
            $entities = $this->clase()::orderBy($order_column, $order_type)->paginate($limit);
            if ($entities!=NULL) {

                foreach($entities as $entity) {

                    $this->makeRelationship($entity);
                }
            }
            return $this->sendResponse($entities, $filters);
        }
    }

    public function getData(Request $request)
    {
        $filters = $request->all();
        $seasons = $this->clase()::select('*');


        if (isset($filters)&&count($filters)>0) {


            foreach($filters as $key=>$filter) {
                if($key != 'id_agent_saleCanceled'&&$key!=='name'&&$key!=='type'&&$key!=='street'&&$key!=='page'&&$key!=='limit'){
                    $seasons = $seasons->where($key, $filter);
                }
                if($key=='name'){
                    $seasons = $seasons->where('name', 'LIKE', '%'.$filter.'%');
                }
                if($key=='type'){
                    $seasons = $seasons->where('type', 'LIKE', '%'.$filter.'%');
                }
                if($key=='street'){
                    $seasons = $seasons->where('street', 'LIKE', '%'.$filter.'%');
                }
            }

            $entities = $seasons->get();

            if ($entities!=NULL) {
                foreach($entities as $entity) {
                    $this->makeRelationship($entity);
                }
            }
            return $this->sendResponse($entities, $filters);
        } else {
            $entities = $this->clase()::select('*');
            $entities = $entities->get();
            if ($entities!=NULL) {

                foreach($entities as $entity) {

                    $this->makeRelationship($entity);
                }
            }
            return $this->sendResponse($entities, $filters);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $entity = $this->clase()::find($id);
        if($entity==null) return $this->sendError("Object not found", 'Id not found', 404);

        $this->makeRelationship($entity);
        return response()->json($entity, 200);
        // return $this->sendResponse($entity, 'FOUND');
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
            $obj = $this->clase()::create($input);
            return response()->json($obj, 200);
        }
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $object = $this->clase()::find($id);
        if ($object!==null)
        {
            $object->delete();

            return response()->json($object, 200);
        }
        else
            return $this->sendError('Not found', ['The object doesnt found']);

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



    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendError($error, $errorMessages = [], $code = 404)
    {
    	$response = [
            'success' => false,
            'message' => $error,
        ];


        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }
}

