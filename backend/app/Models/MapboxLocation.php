<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MapboxLocation extends Model{
    protected $fillable=['user_id','query','place_name','latitude','longitude','place_type','raw_data'];
    protected $casts=['raw_data'=>'array'];
    public function user(){ return $this->belongsTo(User::class); }
}
