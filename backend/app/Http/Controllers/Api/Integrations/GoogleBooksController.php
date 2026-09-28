<?php
namespace App\Http\Controllers\Api\Integrations;
use App\Http\Controllers\Controller;
use App\Services\GoogleBooksService;
use App\Models\GoogleBook;
use Illuminate\Http\Request;
class GoogleBooksController extends Controller{
    protected $svc; public function __construct(GoogleBooksService $s){ $this->svc=$s; }
    public function search(Request $r){
        $r->validate(['query'=>'required|string|min:2']); $q=$r->input('query');
        try{
            $data=$this->svc->search($q,10);
            if(empty($data['items'])) return response()->json(['message'=>'No books found','totalItems'=>0,'books'=>[]],404);
            $first=$data['items'][0]; $info=$first['volumeInfo'];
            $saved=GoogleBook::create([
                'user_id'=>$r->user()->id,'google_id'=>$first['id'],'query'=>$q,
                'title'=>$info['title']??'No Title','authors'=>$info['authors']??[],'publisher'=>$info['publisher']??null,
                'published_date'=>$info['publishedDate']??null,'description'=>$info['description']??null,
                'thumbnail'=>$info['imageLinks']['thumbnail']??null,'raw_data'=>$first
            ]);
            return response()->json(['message'=>'Google Books -> MySQL (FREE, No billing)','totalItems'=>$data['totalItems']??0,'books'=>$data['items'],'stored'=>$saved]);
        }catch(\Exception $e){ return response()->json(['error'=>$e->getMessage()],500); }
    }
    public function index(Request $r){ return response()->json($r->user()->googleBooks()->latest()->get()); }
}
