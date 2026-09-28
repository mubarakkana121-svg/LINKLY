<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('google_books', function (Blueprint $t){
            $t->id(); $t->foreignId('user_id')->constrained()->onDelete('cascade');
            $t->string('google_id'); $t->string('query'); $t->string('title');
            $t->json('authors')->nullable(); $t->string('publisher')->nullable();
            $t->string('published_date')->nullable(); $t->text('description')->nullable();
            $t->string('thumbnail')->nullable(); $t->json('raw_data')->nullable(); $t->timestamps();
        });
    }
    public function down(): void{ Schema::dropIfExists('google_books'); }
};
