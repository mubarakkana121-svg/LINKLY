<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function index(Request $request)
    {
        $files = $request->user()->files()->latest()->get();

        return response()->json($files);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:102400', // 100MB max, in kilobytes
            'expires_in' => 'nullable|string|in:1_hour,1_day,7_days,never',
        ]);

        $uploadedFile = $request->file('file');

        // Keep uploads on Laravel's private disk; they are only served through
        // the expiring, unguessable share-token endpoint below.
        $storedName = Str::uuid()->toString();
        $path = $uploadedFile->storeAs('uploads', $storedName, 'local');

        $expiresAt = match ($request->input('expires_in', 'never')) {
            '1_hour' => now()->addHour(),
            '1_day' => now()->addDay(),
            '7_days' => now()->addDays(7),
            default => null,
        };

        $file = File::create([
            'user_id' => $request->user()->id,
            'original_name' => $uploadedFile->getClientOriginalName(),
            'stored_name' => $storedName,
            'file_path' => $path,
            'file_type' => $uploadedFile->getMimeType(),
            'file_size' => $uploadedFile->getSize(),
            'share_token' => Str::random(48),
            'expires_at' => $expiresAt,
        ]);

        return response()->json($file, 201);
    }

    public function destroy(Request $request, File $file)
    {
        if ($file->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        \Storage::disk($this->diskFor($file))->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted.']);
    }

    public function showByToken(string $token)
    {
        $file = File::where('share_token', $token)->firstOrFail();

        if ($file->expires_at && $file->expires_at->isPast()) {
            return response()->json(['message' => 'This link has expired.'], 410);
        }

        return response()->json([
            'original_name' => $file->original_name,
            'file_type' => $file->file_type,
            'file_size' => $file->file_size,
            'downloads' => $file->downloads,
            'scan_status' => $file->scan_status,
            'expires_at' => $file->expires_at,
            'created_at' => $file->created_at,
        ]);
    }

    public function downloadByToken(string $token)
    {
        $file = File::where('share_token', $token)->firstOrFail();

        if ($file->expires_at && $file->expires_at->isPast()) {
            return response()->json(['message' => 'This link has expired.'], 410);
        }

        $file->increment('downloads');

        $disk = $this->diskFor($file);
        abort_unless(\Storage::disk($disk)->exists($file->file_path), 404);

        return \Storage::disk($disk)->download($file->file_path, $file->original_name, [
            'Content-Type' => 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * Existing uploads were stored on the public disk. Keep them available
     * while all newly created records use the private local disk.
     */
    private function diskFor(File $file): string
    {
        return \Storage::disk('local')->exists($file->file_path) ? 'local' : 'public';
    }
}
