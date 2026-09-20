<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentSettingController extends Controller
{
    /**
     * Display payment settings page for Admin.
     */
    public function index(): Response
    {
        $bankTransferMethods = PaymentMethod::query()
            ->where('category', 'bank_transfer')
            ->orderBy('id')
            ->get();

        $eWalletMethods = PaymentMethod::query()
            ->where('category', 'ewallet')
            ->orderBy('id')
            ->get();

        $appFee = AppSetting::get('app_fee', '1000');

        return Inertia::render('admin/payment-settings/index', [
            'bankTransferMethods' => $bankTransferMethods,
            'eWalletMethods' => $eWalletMethods,
            'appFee' => (float) $appFee,
        ]);
    }

    /**
     * Update active status and fee parameters for a payment method.
     */
    public function updateMethod(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
            'fee_type' => ['sometimes', 'in:fixed,percentage'],
            'fee_amount' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $paymentMethod->update($validated);

        return redirect()->back()->with('flash.toast', [
            'type' => 'success',
            'message' => "Metode pembayaran {$paymentMethod->name} berhasil diperbarui.",
        ]);
    }

    /**
     * Update global application development fee.
     */
    public function updateAppFee(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'app_fee' => ['required', 'numeric', 'min:0'],
        ]);

        AppSetting::set(
            'app_fee',
            (string) $validated['app_fee'],
            'Biaya Admin Aplikasi (Pengembangan)'
        );

        return redirect()->back()->with('flash.toast', [
            'type' => 'success',
            'message' => 'Biaya Admin Aplikasi berhasil diperbarui.',
        ]);
    }
}
