<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class MapboxService{
    protected $token; protected $baseUrl='https://api.mapbox.com/geocoding/v5/mapbox.places';
    public function __construct(){ $this->token=config('services.mapbox.token'); }
    public function geocode($q){
        $q=is_string($q)?$q:(string)$q; $enc=urlencode($q); $url=$this->baseUrl.'/'.$enc.'.json';
        $r=Http::get($url,['access_token'=>$this->token,'limit'=>5]);
        if($r->failed()) throw new \Exception('Mapbox Error: '.$r->body());
        return $r->json();
    }
    public function searchLocation($q){
        $data=$this->geocode($q); if(empty($data['features'])) return null;
        $f=$data['features'][0];
        return ['place_name'=>$f['place_name'],'lat'=>$f['center'][1],'lng'=>$f['center'][0],'place_type'=>$f['place_type'][0]??'place','raw'=>$f,'full_response'=>$data];
    }
}
