<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ResearchItemController;
use App\Models\ResearchItem;
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

    /*
    Route::get('research-items', function () {
        return Inertia::render('research-items/index', [
            'researchItems' => ResearchItem::all()
        ]);
    })->name('research-items');
    */


    Route::get('research-items', [HomeController::class, 'researchItems'])->name('research-items');

    Route::put('/research-item/{id}/select-category', [ResearchItemController::class, 'selectCategory'])->name('research-item.selectCategory');
    Route::put('/research-item/{id}/remove-favorite', [ResearchItemController::class, 'removeFavorite'])->name('research-item.removeFavorite');
    Route::put('/research-item/{id}/add-favorite', [ResearchItemController::class, 'addFavorite'])->name('research-item.addFavorite');
    // Route::post('/fetch-metadata', [MetadataController::class, 'fetchMetadata'])->name('metadata.fetch');

    Route::resource('research-item', ResearchItemController::class);
    Route::resource('category', CategoryController::class);
});

require __DIR__.'/settings.php';
