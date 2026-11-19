# ========================================
# VERCEL FRONTEND DEPLOYMENT
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Frontend to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# First, check authentication status
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Authenticated as: $whoami" -ForegroundColor Green
    Write-Host ""
    
    # Deploy directly
    Write-Host "Deploying to production..." -ForegroundColor Yellow
    Write-Host ""
    
    vercel --prod --yes --confirm
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next: Add environment variable" -ForegroundColor Yellow
        Write-Host "Run: vercel env add VITE_API_URL production" -ForegroundColor White
        Write-Host "Enter: https://care-integrity-api.onrender.com/api" -ForegroundColor White
    } else {
        Write-Host "Deployment failed. See errors above." -ForegroundColor Red
    }
} else {
    Write-Host "Not authenticated. Starting login..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please complete authentication in your browser." -ForegroundColor White
    Write-Host "After authentication, run this script again." -ForegroundColor White
    Write-Host ""
    
    vercel login
}
