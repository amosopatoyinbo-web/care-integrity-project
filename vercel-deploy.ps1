# Complete Vercel Deployment with Persistent Auth
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Care Integrity - Vercel Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if already authenticated
$authCheck = vercel whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Already authenticated as: $authCheck" -ForegroundColor Green
} else {
    Write-Host "Please authenticate with Vercel..." -ForegroundColor Yellow
    Write-Host "A browser window will open. Complete the authorization." -ForegroundColor White
    Write-Host ""
    
    # Start login process
    $loginProcess = Start-Process -FilePath "vercel" -ArgumentList "login" -NoNewWindow -PassThru -Wait
    
    if ($loginProcess.ExitCode -ne 0) {
        Write-Host "Authentication failed or was cancelled." -ForegroundColor Red
        Write-Host ""
        Write-Host "To deploy manually:" -ForegroundColor Yellow
        Write-Host "1. Run: vercel login" -ForegroundColor White
        Write-Host "2. Complete authentication in browser" -ForegroundColor White
        Write-Host "3. Run: vercel --prod" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "Starting deployment..." -ForegroundColor Yellow
Write-Host ""

# Deploy to production
vercel --prod --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Please check the error above and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Frontend Deployed Successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Step: Configure Environment Variable" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 - Using Vercel CLI:" -ForegroundColor Cyan
Write-Host "  vercel env add VITE_API_URL production" -ForegroundColor White
Write-Host "  (When prompted, enter: https://care-integrity-api.onrender.com/api)" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 - Using Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "  1. Visit your project at: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Go to Settings > Environment Variables" -ForegroundColor White
Write-Host "  3. Add: VITE_API_URL = https://care-integrity-api.onrender.com/api" -ForegroundColor White
Write-Host "  4. Select 'Production' environment" -ForegroundColor White
Write-Host "  5. Click 'Save' and redeploy" -ForegroundColor White
Write-Host ""
