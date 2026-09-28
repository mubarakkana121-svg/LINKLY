<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class GoogleBooksService{
    protected $baseUrl='https://www.googleapis.com/books/v1/volumes';
    public function search($q, $max=10){
        $r=Http::get($this->baseUrl,['q'=>$q,'maxResults'=>$max]);
        if($r->failed()) throw new \Exception('Google Books Error: '.$r->body());
        return $r->json();
    }
}
