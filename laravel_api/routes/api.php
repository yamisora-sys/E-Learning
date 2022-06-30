<?php
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\LessonController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RecordController;
use App\Http\Controllers\API\FeedbackController;
use App\Http\Controllers\API\UpgradeTeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/students', [StudentController::class, 'index']);

Route::post('/add-student', [StudentController::class, 'store']);

Route::get('/edit-student/{id}', [StudentController::class, 'edit']);

Route::put('/update-student/{id}', [StudentController::class, 'update']);

Route::delete('/delete-student/{id}', [StudentController::class, 'destroy']);

// Course

Route::get('/courses', [CourseController::class, 'index']);

Route::post('/add-course', [CourseController::class, 'store']);

Route::get('/edit-course/{id}', [CourseController::class, 'edit']);

Route::put('/update-course/{id}', [CourseController::class, 'update']);

Route::delete('/delete-course/{id}', [CourseController::class, 'destroy']);

// Lesson
Route::get('/lessons/{id}', [LessonController::class, 'index']);
Route::post('/add-lesson', [LessonController::class, 'store']);
Route::delete('/delete-lesson/{id}', [LessonController::class, 'destroy']);
Route::get('/edit-lesson/{id}', [LessonController::class, 'edit']);
Route::put('/update-lesson/{id}', [LessonController::class, 'update']);
Route::post('/update-video/{id}', [LessonController::class, 'updatevideo']);

// User
Route::post('/users/login', [UserController::class, 'onLogin']);
Route::post('/users/register', [UserController::class, 'register']);


// Feedback
Route::get('/feedback/{id}', [FeedbackController::class, 'index']);
Route::post('/save-feedback', [FeedbackController::class, 'save_feedback']);


// Upgrade Teacher
Route::post('/request-to-become-teacher', [UpgradeTeacherController::class, 'RequestBecomeTeacher']);
//accept request
Route::put('/upgrade-teacher', [UpgradeTeacherController::class, 'upgrade_to_teacher']);

Route::get('/popular-courses', [CourseController::class, 'popular_courses']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
