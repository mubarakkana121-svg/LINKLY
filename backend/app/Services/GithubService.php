<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class GithubService{
    protected $token; protected $baseUrl='https://api.github.com';
    public function __construct(){ $this->token=config('services.github.token'); }
    public function getUser(){
        $r=Http::withToken($this->token)->get($this->baseUrl.'/user');
        if($r->failed()) throw new \Exception('GitHub Error: '.$r->body());
        return $r->json();
    }
    public function getRepos(){
        $r=Http::withToken($this->token)->get($this->baseUrl.'/user/repos',['per_page'=>100,'sort'=>'updated']);
        if($r->failed()) throw new \Exception('GitHub Error: '.$r->body());
        return $r->json();
    }
}
