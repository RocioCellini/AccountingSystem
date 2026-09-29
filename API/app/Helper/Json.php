<?php

namespace App\Helper;

class Json
{
	/**
     * Plantilla de respuesta para ok con data
     * @param $message
     * @param $data
     * @param $code
     * @return array
     */
	public static function ok($message = null, $data = null, $code=200): array
    {
        return [
        	'status' => 'ok',
        	'code' => $code,
        	'message' => $message,
            'data' => $data,
        ];
    }
	/**
     * Plantilla de respuesta para ok con data
     * @param $message
     * @param $data
     * @param $code
     * @return array
     */
	public static function okWithLabels($message = null, $data = null,$labels = null, $values = null, $code=200): array
    {
        return [
        	'status' => 'ok',
        	'code' => $code,
        	'message' => $message,
            'data' => $data,
            'labels' => $labels,
            'values' => $values
        ];
    }

    /**
     * Plantilla de respuesta para error con mensaje
     * @param $message
     * @param $code
     * @return array
     */
    public static function error($message = null, $data = null,$code = 404): array
    {
        return [
        	'status' => 'error',
            'code' => $code,
            'message' => $message,
            'data' => $data,
        ];
    }

    /**
     * Plantilla de respuesta para ok con data
     * @param $message
     * @param $data
     * @param $code
     * @return array
     */
    public static function okWithOrder($message = null, $data = null, $orderBy = null, $sort = null, $code=200): array
    {
        return [
            'status' => 'ok',
            'code' => $code,
            'message' => $message,
            'orderby' => $orderBy,
            'sort' => $sort,
            'data' => $data,
        ];
    }

    public static function errorRequest($message = null, $data = null,$code = 422): array
    {

        return [
            'status' => 'error',
            'code' => $code,
            'message' => $message,
            'data' => $data->errors()->toArray(),
        ];
    }
}
