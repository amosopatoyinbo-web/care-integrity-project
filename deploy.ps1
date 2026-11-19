# Vercel Deployment Script for Care Integrity Project
# This script automates the deployment after you authenticate

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Care Integrity Project - Vercel Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Vercel
Write-Host "STEP 1: Authenticating with Vercel..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please log in and authorize the CLI." -ForegroundColor White
Write-Host ""

vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Authentication failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Authentication successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy to production
Write-Host "STEP 2: Deploying to Vercel production..." -ForegroundColor Yellow
Write-Host ""

vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed. Check the error above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Add environment variable to Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to your Vercel project dashboard" -ForegroundColor White
Write-Host "2. Navigate to Settings -> Environment Variables" -ForegroundColor White
Write-Host "3. Add: VITE_API_URL = https://care-integrity-api.onrender.com/api" -ForegroundColor White
Write-Host "4. Redeploy to apply the environment variable" -ForegroundColor White
Write-Host ""
