<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransacaoController;
use Laravel\Fortify\Features;

Route::inertia('/', '/extrato', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/extrato', [TransacaoController::class, 'index']);

Route::post('/extrato', [TransacaoController::class, 'store']);

Route::put('/extrato/{id}', [TransacaoController::class, 'update']);

Route::delete('/extrato/{id}', [TransacaoController::class, 'destroy']);

require __DIR__.'/settings.php';
