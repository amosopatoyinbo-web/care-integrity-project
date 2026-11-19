#!/usr/bin/env pwsh
# Vercel Automated Deployment Script
# This script will deploy The Care Integrity Project to Vercel

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   VERCEL DEPLOYMENT SCRIPT" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Set project directory
$projectDir = "c:\Users\USER\Desktop\The integrity caregiver\care-integrity-project"
Set-Location $projectDir

# Step 1: Verify build exists
Write-Host "Step 1: Verifying build..." -ForegroundColor Cyan
if (!(Test-Path "dist")) {
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Build verified" -ForegroundColor Green
Write-Host ""

# Step 2: Check for Vercel CLI
Write-Host "Step 2: Checking Vercel CLI..." -ForegroundColor Cyan
$vercelCmd = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelCmd) {
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
}
Write-Host "✅ Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy to Vercel
Write-Host "Step 3: Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will open your browser for authentication if needed." -ForegroundColor Yellow
Write-Host "Please follow the prompts in your browser." -ForegroundColor Yellow
Write-Host ""

# Deploy with production flag
vercel --prod

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT PROCESS COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 IMPORTANT: After deployment, add environment variable:" -ForegroundColor Yellow
Write-Host "   1. Go to Vercel Dashboard → Project Settings → Environment Variables" -ForegroundColor White
Write-Host "   2. Add: VITE_API_URL = https://care-integrity-api.onrender.com/api" -ForegroundColor White
Write-Host "   3. Redeploy after adding the variable" -ForegroundColor White
Write-Host ""
