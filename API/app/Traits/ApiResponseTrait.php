<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Contracts\Pagination\Paginator;

trait ApiResponseTrait
{

    /**
     * Success Response
     * @param $message
     * @param int $code
     * @return JsonResponse
     */
    public function successResponse($data, $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'status' => 'success',
            'data' => $data
        ], $code);
    }

    /**
     * Error Response
     * @param $message
     * @param int $code
     * @return JsonResponse
     *
     */
    public function errorResponse($message, $code = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'status' => 'fail',
            'error' => $message
        ], $code);
    }

    /**
     * Paginate Response
     * @param Paginator $paginate
     * @return JsonResponse
     */
    public function successPaginateResponse(Paginator $paginate): JsonResponse
    {
        $data = [
            'data' => $paginate->items(),
            'pagination' => [
                'currentPage' => $paginate->currentPage(),
                'perPage' => $paginate->perPage(),
                'totalPages' => $paginate->lastPage(),
                'totalRows' => $paginate->total()
            ]
        ];

        return $this->successResponse($data);
    }
}
