<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_files' => File::count(),
            'total_downloads' => File::sum('downloads'),
            'storage_used' => File::sum('file_size'),
        ]);
    }

    public function users()
    {
        $users = User::withCount('files')->latest()->get();

        return response()->json($users);
    }

    public function deleteUser(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        // Eloquent's database cascade removes rows, but not physical uploads.
        // Delete them first so admin cleanup never leaves orphaned private files.
        $user->files()->each(function (File $file) {
            \Storage::disk(\Storage::disk('local')->exists($file->file_path) ? 'local' : 'public')->delete($file->file_path);
        });
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    public function files()
    {
        $files = File::with('user:id,name,email')->latest()->get();

        return response()->json($files);
    }

    public function deleteFile(File $file)
    {
        \Storage::disk(\Storage::disk('local')->exists($file->file_path) ? 'local' : 'public')->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted.']);
    }
}
