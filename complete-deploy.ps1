Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERCEL LOGIN & DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Authentication" -ForegroundColor Yellow
Write-Host "A browser window will open. Please complete the authorization." -ForegroundColor White
Write-Host ""

# Login
& vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Login failed or was cancelled." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Verify Authentication" -ForegroundColor Yellow
$user = & vercel whoami 2>&1
Write-Host "Logged in as: $user" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Deploy to Production" -ForegroundColor Yellow
Write-Host ""

& vercel --prod --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Step 4: Add Environment Variable" -ForegroundColor Yellow
Write-Host "Running: vercel env add VITE_API_URL production" -ForegroundColor White
Write-Host ""

# This will prompt for the value
& vercel env add VITE_API_URL production

Write-Host ""
Write-Host "All done! Your app is live." -ForegroundColor Green
Write-Host ""
