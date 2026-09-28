<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('mapbox_locations', function (Blueprint $t){
            $t->id();
            $t->foreignId('user_id')->constrained()->onDelete('cascade');
            $t->string('query'); $t->string('place_name');
            $t->decimal('latitude',10,7); $t->decimal('longitude',10,7);
            $t->string('place_type')->nullable(); $t->json('raw_data')->nullable(); $t->timestamps();
        });
    }
    public function down(): void{ Schema::dropIfExists('mapbox_locations'); }
};
