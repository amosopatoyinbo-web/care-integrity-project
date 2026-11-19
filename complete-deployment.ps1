# ========================================
# COMPLETE VERCEL DEPLOYMENT WORKFLOW
# Error-Resistant Deployment Process
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERCEL DEPLOYMENT WORKFLOW" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify local build works
Write-Host "Step 1: Verifying local build..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Local build failed. Fix build errors first." -ForegroundColor Red
    npm run build
    exit 1
}

Write-Host "✓ Local build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Check authentication
Write-Host "Step 2: Checking Vercel authentication..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Not authenticated. Please complete authentication." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✓ Authenticated as: $whoami" -ForegroundColor Green
Write-Host ""

# Step 3: Check if project exists
Write-Host "Step 3: Checking project status..." -ForegroundColor Yellow
$projectExists = $false
$projectName = "care-integrity-project-live"

try {
    vercel ls 2>&1 | Out-Null
    $projectExists = $true
    Write-Host "✓ Project exists: $projectName" -ForegroundColor Green
} catch {
    Write-Host "Project will be created during deployment" -ForegroundColor Gray
}

Write-Host ""

# Step 4: Deploy with retry logic
Write-Host "Step 4: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""

$maxRetries = 3
$retryCount = 0
$deployed = $false

while ($retryCount -lt $maxRetries -and -not $deployed) {
    if ($retryCount -gt 0) {
        Write-Host "Retry attempt $retryCount of $maxRetries..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
    
    $deployOutput = vercel --prod --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $deployed = $true
        Write-Host ""
        Write-Host "✓ Deployment successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host $deployOutput
    } else {
        $retryCount++
        Write-Host "✗ Deployment attempt failed" -ForegroundColor Red
        
        if ($retryCount -lt $maxRetries) {
            Write-Host "Will retry..." -ForegroundColor Yellow
        }
    }
}

if (-not $deployed) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "DEPLOYMENT FAILED AFTER $maxRetries ATTEMPTS" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Deploy via Vercel Dashboard" -ForegroundColor Yellow
    Write-Host "1. Visit: https://vercel.com/new" -ForegroundColor White
    Write-Host "2. Import: care-integrity-project from GitHub" -ForegroundColor White
    Write-Host "3. Framework: Vite" -ForegroundColor White
    Write-Host "4. Add Environment Variable:" -ForegroundColor White
    Write-Host "   VITE_API_URL = https://care-integrity-api.onrender.com/api" -ForegroundColor Gray
    Write-Host "5. Deploy" -ForegroundColor White
    exit 1
}

# Step 5: Verify environment variables
Write-Host ""
Write-Host "Step 5: Verifying environment variables..." -ForegroundColor Yellow

$envList = vercel env ls 2>&1 | Out-String

if ($envList -match "VITE_API_URL") {
    Write-Host "✓ VITE_API_URL is configured" -ForegroundColor Green
} else {
    Write-Host "⚠ VITE_API_URL not found, adding it now..." -ForegroundColor Yellow
    echo "https://care-integrity-api.onrender.com/api" | vercel env add VITE_API_URL production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Environment variable added" -ForegroundColor Green
        Write-Host ""
        Write-Host "Redeploying with new environment variable..." -ForegroundColor Yellow
        vercel --prod --yes
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  https://care-integrity-api.onrender.com" -ForegroundColor Cyan
Write-Host "Frontend: Check output above for your Vercel URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test caregiver profile image upload" -ForegroundColor White
Write-Host "2. Test agency profile logo upload" -ForegroundColor White
Write-Host "3. Verify images display immediately without refresh" -ForegroundColor White
Write-Host ""
