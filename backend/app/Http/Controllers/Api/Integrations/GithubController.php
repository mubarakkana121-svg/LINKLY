<?php
namespace App\Http\Controllers\Api\Integrations;
use App\Http\Controllers\Controller;
use App\Services\GithubService;
use App\Models\GithubRepo;
use Illuminate\Http\Request;
class GithubController extends Controller{
    protected $svc; public function __construct(GithubService $s){ $this->svc=$s; }
    public function user(Request $r){ try{ $u=$this->svc->getUser(); return response()->json(['message'=>'GitHub OK','data'=>$u]); }catch(\Exception $e){ return response()->json(['error'=>$e->getMessage()],500); } }
    public function repos(Request $r){
        try{
            $repos=$this->svc->getRepos(); $saved=[];
            foreach($repos as $repo){
                $saved[] = GithubRepo::updateOrCreate(['github_id'=>$repo['id']],[
                    'user_id'=>$r->user()->id,'name'=>$repo['name'],'full_name'=>$repo['full_name'],'description'=>$repo['description'],
                    'html_url'=>$repo['html_url'],'private'=>$repo['private'],'fork'=>$repo['fork'],'language'=>$repo['language']??null,
                    'stars'=>$repo['stargazers_count']??0,'forks_count'=>$repo['forks_count']??0,'raw_data'=>$repo
                ]);
            }
            return response()->json(['message'=>'GitHub -> MySQL','count'=>count($saved),'repos'=>$saved]);
        }catch(\Exception $e){ return response()->json(['error'=>$e->getMessage()],500); }
    }
    public function local(Request $r){ return response()->json(['data'=>$r->user()->githubRepos()->latest()->get()]); }
}
