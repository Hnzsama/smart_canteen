<?php

use App\Enums\UserRole;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentSettingController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\MidtransCallbackController;
use App\Http\Controllers\Auth\RegisteredTenantController;
use App\Http\Controllers\Customer\CatalogController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Tenant\CategoryController as TenantCategoryController;
use App\Http\Controllers\Tenant\DashboardController as TenantDashboardController;
use App\Http\Controllers\Tenant\MenuController as TenantMenuController;
use App\Http\Controllers\Tenant\OrderController as TenantOrderController;
use App\Http\Controllers\Tenant\RatingController as TenantRatingController;
use App\Http\Controllers\Tenant\SettingsController as TenantSettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [CatalogController::class, 'index'])->name('home');
Route::post('api/midtrans/callback', [MidtransCallbackController::class, 'handleCallback'])->name('midtrans.callback');

Route::middleware('guest')->group(function () {
    Route::get('register/tenant', [RegisteredTenantController::class, 'create'])->name('register.tenant');
    Route::post('register/tenant', [RegisteredTenantController::class, 'store'])->name('register.tenant.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Mahasiswa / General routes
    Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
    Route::get('menu/{menu}', [CatalogController::class, 'showMenu'])->name('catalog.menu');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('orders/{order}/payment', [CheckoutController::class, 'payment'])->name('orders.payment');
    Route::get('orders', [CustomerOrderController::class, 'index'])->name('orders.index');
    Route::get('orders/history', [CustomerOrderController::class, 'history'])->name('orders.history');
    Route::get('orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{order}/status', [CustomerOrderController::class, 'status'])->name('orders.status');
    Route::get('orders/{order}/success', [CustomerOrderController::class, 'success'])->name('orders.success');
    Route::post('orders/{order}/rate', [CustomerOrderController::class, 'rate'])->name('orders.rate');

    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        if ($user?->hasRole(UserRole::Admin->value)) {
            return redirect()->route('admin.dashboard');
        }
        if ($user?->hasRole(UserRole::Tenant->value)) {
            return redirect()->route('tenant.dashboard');
        }

        return redirect()->route('catalog');
    })->name('dashboard');

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('tenants', [TenantController::class, 'index'])->name('tenants');
        Route::post('tenants', [TenantController::class, 'store'])->name('tenants.store');
        Route::put('tenants/{tenant}', [TenantController::class, 'update'])->name('tenants.update');
        Route::delete('tenants/{tenant}', [TenantController::class, 'destroy'])->name('tenants.destroy');
        Route::post('tenants/{tenant}/restore', [TenantController::class, 'restore'])->withTrashed()->name('tenants.restore');
        Route::patch('tenants/{tenant}/toggle-status', [TenantController::class, 'toggleStatus'])->name('tenants.toggle-status');

        Route::get('users', [UserController::class, 'index'])->name('users');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::post('users/{user}/restore', [UserController::class, 'restore'])->withTrashed()->name('users.restore');
        Route::patch('users/{user}/toggle-verify', [UserController::class, 'toggleVerify'])->name('users.toggle-verify');

        Route::get('categories', [CategoryController::class, 'index'])->name('categories');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('orders', [OrderController::class, 'index'])->name('orders');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::delete('orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');

        Route::get('payment-settings', [PaymentSettingController::class, 'index'])->name('payment-settings.index');
        Route::patch('payment-settings/methods/{paymentMethod}', [PaymentSettingController::class, 'updateMethod'])->name('payment-settings.update-method');
        Route::post('payment-settings/app-fee', [PaymentSettingController::class, 'updateAppFee'])->name('payment-settings.update-app-fee');
    });

    // Tenant routes
    Route::middleware('role:tenant')->prefix('tenant')->name('tenant.')->group(function () {
        Route::get('dashboard', [TenantDashboardController::class, 'index'])->name('dashboard');
        Route::get('orders', [TenantOrderController::class, 'index'])->name('orders');
        Route::patch('orders/{order}/status', [TenantOrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::get('verify-payment', [TenantOrderController::class, 'verifyPaymentIndex'])->name('verify-payment');
        Route::post('orders/{order}/confirm-cash', [TenantOrderController::class, 'confirmCashPayment'])->name('orders.confirm-cash');
        Route::get('menus', [TenantMenuController::class, 'index'])->name('menus');
        Route::get('menus/create', [TenantMenuController::class, 'create'])->name('menus.create');
        Route::post('menus', [TenantMenuController::class, 'store'])->name('menus.store');
        Route::post('menus/{menu}/restore', [TenantMenuController::class, 'restore'])->withTrashed()->name('menus.restore');
        Route::get('menus/{menu}/edit', [TenantMenuController::class, 'edit'])->name('menus.edit');
        Route::put('menus/{menu}', [TenantMenuController::class, 'update'])->name('menus.update');
        Route::patch('menus/{menu}/toggle-availability', [TenantMenuController::class, 'toggleAvailability'])->name('menus.toggle-availability');
        Route::patch('menus/{menu}/toggle-recommendation', [TenantMenuController::class, 'toggleRecommendation'])->name('menus.toggle-recommendation');
        Route::delete('menus/{menu}', [TenantMenuController::class, 'destroy'])->name('menus.destroy');
        Route::get('categories', [TenantCategoryController::class, 'index'])->name('categories');
        Route::post('categories', [TenantCategoryController::class, 'store'])->name('categories.store');
        Route::put('categories/{category}', [TenantCategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [TenantCategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('settings', [TenantSettingsController::class, 'edit'])->name('settings');
        Route::post('settings', [TenantSettingsController::class, 'update'])->name('settings.update');
        Route::post('settings/toggle-open', [TenantSettingsController::class, 'toggleOpen'])->name('settings.toggle-open');

        Route::get('ratings', [TenantRatingController::class, 'index'])->name('ratings');
    });
});

require __DIR__.'/settings.php';

Route::get('{tenant:slug}', [CatalogController::class, 'showTenant'])->name('catalog.tenant');
