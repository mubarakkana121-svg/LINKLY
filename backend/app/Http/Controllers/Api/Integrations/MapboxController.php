<?php
namespace App\Http\Controllers\Api\Integrations;
use App\Http\Controllers\Controller;
use App\Services\MapboxService;
use App\Models\MapboxLocation;
use Illuminate\Http\Request;
class MapboxController extends Controller{
    protected $svc; public function __construct(MapboxService $s){ $this->svc=$s; }
    public function search(Request $r){
        $r->validate(['query'=>'required|string|min:2']); $q=$r->input('query');
        try{
            $res=$this->svc->searchLocation($q); if(!$res) return response()->json(['message'=>'Not found for: '.$q],404);
            $loc=MapboxLocation::create(['user_id'=>$r->user()->id,'query'=>$q,'place_name'=>$res['place_name'],'latitude'=>$res['lat'],'longitude'=>$res['lng'],'place_type'=>$res['place_type'],'raw_data'=>$res['full_response']]);
            return response()->json(['message'=>'Mapbox -> MySQL','mapbox'=>$res,'stored'=>$loc]);
        }catch(\Exception $e){ return response()->json(['error'=>$e->getMessage()],500); }
    }
    public function index(Request $r){ return response()->json($r->user()->mapboxLocations()->latest()->get()); }
}
