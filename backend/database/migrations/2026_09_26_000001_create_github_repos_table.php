<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('github_repos', function (Blueprint $t){
            $t->id(); $t->foreignId('user_id')->constrained()->onDelete('cascade');
            $t->bigInteger('github_id')->unique(); $t->string('name'); $t->string('full_name');
            $t->text('description')->nullable(); $t->string('html_url'); $t->boolean('private')->default(false);
            $t->boolean('fork')->default(false); $t->string('language')->nullable(); $t->integer('stars')->default(0);
            $t->integer('forks_count')->default(0); $t->json('raw_data')->nullable(); $t->timestamps();
        });
    }
    public function down(): void{ Schema::dropIfExists('github_repos'); }
};
