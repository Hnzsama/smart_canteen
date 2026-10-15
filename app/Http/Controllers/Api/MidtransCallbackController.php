<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransCallbackController extends Controller
{
    /**
     * Handle incoming notification webhook callback from Midtrans.
     */
    public function handleCallback(Request $request, MidtransService $midtransService): JsonResponse
    {
        $success = $midtransService->handleNotification($request->all());

        if (! $success) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to process Midtrans notification.',
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Midtrans notification processed successfully.',
        ]);
    }
}
