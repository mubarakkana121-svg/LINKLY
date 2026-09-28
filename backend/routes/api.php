<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\Integrations\GithubController;
use App\Http\Controllers\Api\Integrations\MapboxController;
use App\Http\Controllers\Api\Integrations\GoogleBooksController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/user',[AuthController::class,'user']);
    Route::apiResource('files', FileController::class);
    Route::prefix('integrations')->group(function(){
        Route::get('/github/user',[GithubController::class,'user']);
        Route::get('/github/repos',[GithubController::class,'repos']);
        Route::get('/github/repos/local',[GithubController::class,'local']);
        Route::post('/mapbox/search',[MapboxController::class,'search']);
        Route::get('/mapbox/locations',[MapboxController::class,'index']);
        Route::post('/google-books/search',[GoogleBooksController::class,'search']);
        Route::get('/google-books',[GoogleBooksController::class,'index']);
    });
});
