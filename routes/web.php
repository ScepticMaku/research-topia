<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookmarkController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirect'])->name('auth.redirect');
Route::get('/auth/{provider}/callback', [AuthController::class, 'callback']);

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('bookmarks', function () {
        return Inertia::render('bookmarks/index');
    })->name('bookmarks');

    Route::resource('bookmark', BookmarkController::class);
});

require __DIR__.'/settings.php';
