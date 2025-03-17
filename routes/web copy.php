<?php

use App\Http\Controllers\DraftController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/create-cv/{id}', [DraftController::class, 'CreateCV'])->name('CreateCV');
    Route::get('/go-to-cv/{cvId}/{draftId}', [DraftController::class, 'GoToCv'])->name('GoToCv');
    Route::post('/save-draft', [DraftController::class, 'SaveDraft'])->name('saveDraft');
});

require __DIR__.'/auth.php';
