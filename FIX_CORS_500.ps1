
$root = "C:\Users\admin\LINKLY"
Write-Host "=== FIX CORS + 500 ===" -ForegroundColor Cyan

function Write-B64($b64, $relPath) {
    $full = Join-Path $root $relPath
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bytes = [System.Convert]::FromBase64String($b64)
    [System.IO.File]::WriteAllBytes($full, $bytes)
    Write-Host "OK $relPath" -ForegroundColor Green
}

Write-B64 "PD9waHAKcmV0dXJuIFsKICAgICdwYXRocycgPT4gWydhcGkvKicsICdzYW5jdHVtL2NzcmYtY29va2llJ10sCiAgICAnYWxsb3dlZF9tZXRob2RzJyA9PiBbJyonXSwKICAgICdhbGxvd2VkX29yaWdpbnMnID0+IFsnKiddLAogICAgJ2FsbG93ZWRfb3JpZ2luc19wYXR0ZXJucycgPT4gW10sCiAgICAnYWxsb3dlZF9oZWFkZXJzJyA9PiBbJyonXSwKICAgICdleHBvc2VkX2hlYWRlcnMnID0+IFtdLAogICAgJ21heF9hZ2UnID0+IDAsCiAgICAnc3VwcG9ydHNfY3JlZGVudGlhbHMnID0+IGZhbHNlLApdOwo=" "backend\config\cors.php"
Write-B64 "PD9waHAKdXNlIElsbHVtaW5hdGVcU3VwcG9ydFxGYWNhZGVzXFJvdXRlOwp1c2UgQXBwXEh0dHBcQ29udHJvbGxlcnNcQXBpXEF1dGhDb250cm9sbGVyOwp1c2UgQXBwXEh0dHBcQ29udHJvbGxlcnNcQXBpXEZpbGVDb250cm9sbGVyOwp1c2UgQXBwXEh0dHBcQ29udHJvbGxlcnNcQXBpXEludGVncmF0aW9uc1xHaXRodWJDb250cm9sbGVyOwp1c2UgQXBwXEh0dHBcQ29udHJvbGxlcnNcQXBpXEludGVncmF0aW9uc1xNYXBib3hDb250cm9sbGVyOwp1c2UgQXBwXEh0dHBcQ29udHJvbGxlcnNcQXBpXEludGVncmF0aW9uc1xHb29nbGVCb29rc0NvbnRyb2xsZXI7CgpSb3V0ZTo6cG9zdCgnL3JlZ2lzdGVyJyxbQXV0aENvbnRyb2xsZXI6OmNsYXNzLCdyZWdpc3RlciddKTsKUm91dGU6OnBvc3QoJy9sb2dpbicsW0F1dGhDb250cm9sbGVyOjpjbGFzcywnbG9naW4nXSk7CgpSb3V0ZTo6bWlkZGxld2FyZSgnYXV0aDpzYW5jdHVtJyktPmdyb3VwKGZ1bmN0aW9uKCl7CiAgICBSb3V0ZTo6cG9zdCgnL2xvZ291dCcsW0F1dGhDb250cm9sbGVyOjpjbGFzcywnbG9nb3V0J10pOwogICAgUm91dGU6OmdldCgnL3VzZXInLFtBdXRoQ29udHJvbGxlcjo6Y2xhc3MsJ3VzZXInXSk7CiAgICBSb3V0ZTo6YXBpUmVzb3VyY2UoJ2ZpbGVzJywgRmlsZUNvbnRyb2xsZXI6OmNsYXNzKTsKICAgIFJvdXRlOjpwcmVmaXgoJ2ludGVncmF0aW9ucycpLT5ncm91cChmdW5jdGlvbigpewogICAgICAgIFJvdXRlOjpnZXQoJy9naXRodWIvdXNlcicsW0dpdGh1YkNvbnRyb2xsZXI6OmNsYXNzLCd1c2VyJ10pOwogICAgICAgIFJvdXRlOjpnZXQoJy9naXRodWIvcmVwb3MnLFtHaXRodWJDb250cm9sbGVyOjpjbGFzcywncmVwb3MnXSk7CiAgICAgICAgUm91dGU6OmdldCgnL2dpdGh1Yi9yZXBvcy9sb2NhbCcsW0dpdGh1YkNvbnRyb2xsZXI6OmNsYXNzLCdsb2NhbCddKTsKICAgICAgICBSb3V0ZTo6cG9zdCgnL21hcGJveC9zZWFyY2gnLFtNYXBib3hDb250cm9sbGVyOjpjbGFzcywnc2VhcmNoJ10pOwogICAgICAgIFJvdXRlOjpnZXQoJy9tYXBib3gvbG9jYXRpb25zJyxbTWFwYm94Q29udHJvbGxlcjo6Y2xhc3MsJ2luZGV4J10pOwogICAgICAgIFJvdXRlOjpwb3N0KCcvZ29vZ2xlLWJvb2tzL3NlYXJjaCcsW0dvb2dsZUJvb2tzQ29udHJvbGxlcjo6Y2xhc3MsJ3NlYXJjaCddKTsKICAgICAgICBSb3V0ZTo6Z2V0KCcvZ29vZ2xlLWJvb2tzJyxbR29vZ2xlQm9va3NDb250cm9sbGVyOjpjbGFzcywnaW5kZXgnXSk7CiAgICB9KTsKfSk7Cg==" "backend\routes\api.php"

# Fix User.php
$userPath = Join-Path $root "backend\app\Models\User.php"
if (Test-Path $userPath) {
    $u = Get-Content $userPath -Raw
    if ($u -notmatch "githubRepos") {
        # Insert after use HasApiTokens
        $u = $u -replace "use HasApiTokens;", "use HasApiTokens;`n    public function githubRepos(){ return `$this->hasMany(\App\Models\GithubRepo::class); }`n    public function mapboxLocations(){ return `$this->hasMany(\App\Models\MapboxLocation::class); }`n    public function googleBooks(){ return `$this->hasMany(\App\Models\GoogleBook::class); }"
        Set-Content -Path $userPath -Value $u -Encoding UTF8
        Write-Host "Patched User.php" -ForegroundColor Green
    } else {
        Write-Host "User.php already patched" -ForegroundColor Yellow
    }
}

Write-Host "`nNow running artisan..." -ForegroundColor Cyan
Set-Location "$root\backend"
php artisan config:clear
php artisan migrate --force
php artisan route:clear
Write-Host "`nDONE! Restart php artisan serve" -ForegroundColor Green
Set-Location $root
