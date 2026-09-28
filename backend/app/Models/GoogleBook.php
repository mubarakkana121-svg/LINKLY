<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GoogleBook extends Model{
    protected $fillable=['user_id','google_id','query','title','authors','publisher','published_date','description','thumbnail','raw_data'];
    protected $casts=['authors'=>'array','raw_data'=>'array'];
    public function user(){ return $this->belongsTo(User::class); }
}
