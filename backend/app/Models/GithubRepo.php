<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GithubRepo extends Model{
    protected $fillable=['user_id','github_id','name','full_name','description','html_url','private','fork','language','stars','forks_count','raw_data'];
    protected $casts=['private'=>'boolean','fork'=>'boolean','raw_data'=>'array'];
    public function user(){ return $this->belongsTo(User::class); }
}
