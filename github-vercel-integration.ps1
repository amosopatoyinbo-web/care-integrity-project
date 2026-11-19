# ========================================
# ALTERNATIVE: GitHub → Vercel Integration
# Zero-CLI Deployment Setup
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GITHUB → VERCEL INTEGRATION GUIDE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This method connects your GitHub repo to Vercel for automatic deployments." -ForegroundColor White
Write-Host "Every git push will automatically trigger a new deployment." -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "STEP-BY-STEP INSTRUCTIONS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Open Vercel Dashboard" -ForegroundColor Cyan
Write-Host "   → Visit: https://vercel.com/new" -ForegroundColor White
Write-Host ""

Write-Host "2. Import Git Repository" -ForegroundColor Cyan
Write-Host "   → Click 'Add New...' → 'Project'" -ForegroundColor White
Write-Host "   → Select 'Import Git Repository'" -ForegroundColor White
Write-Host "   → Choose: amosopatoyinbo-web/care-integrity-project" -ForegroundColor Green
Write-Host ""

Write-Host "3. Configure Project Settings" -ForegroundColor Cyan
Write-Host "   Project Name:     care-integrity-project-production" -ForegroundColor White
Write-Host "   Framework:        Vite (should auto-detect)" -ForegroundColor White
Write-Host "   Build Command:    npm run build (auto-filled)" -ForegroundColor White
Write-Host "   Output Directory: dist (auto-filled)" -ForegroundColor White
Write-Host "   Install Command:  npm install (auto-filled)" -ForegroundColor White
Write-Host ""

Write-Host "4. Add Environment Variables" -ForegroundColor Cyan
Write-Host "   → Click 'Add Environment Variable'" -ForegroundColor White
Write-Host ""
Write-Host "   Key:   VITE_API_URL" -ForegroundColor Green
Write-Host "   Value: https://care-integrity-api.onrender.com/api" -ForegroundColor Green
Write-Host ""
Write-Host "   Environment: Production (checked)" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Deploy" -ForegroundColor Cyan
Write-Host "   → Click 'Deploy' button" -ForegroundColor White
Write-Host "   → Wait 2-3 minutes for build to complete" -ForegroundColor White
Write-Host ""

Write-Host "6. Get Your Live URL" -ForegroundColor Cyan
Write-Host "   → After deployment, you'll see:" -ForegroundColor White
Write-Host "   → Production: https://care-integrity-project-production.vercel.app" -ForegroundColor Green
Write-Host "   → (or similar URL)" -ForegroundColor Gray
Write-Host ""

Write-Host "7. Update Backend CORS (IMPORTANT)" -ForegroundColor Cyan
Write-Host "   → Go to: https://dashboard.render.com" -ForegroundColor White
Write-Host "   → Find: care-integrity-api service" -ForegroundColor White
Write-Host "   → Environment → ALLOWED_ORIGINS" -ForegroundColor White
Write-Host "   → Add your Vercel URL to the list" -ForegroundColor White
Write-Host "   → Example: ...existing origins...,https://care-integrity-project-production.vercel.app" -ForegroundColor Gray
Write-Host "   → Save and redeploy backend" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "BENEFITS OF THIS METHOD" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ No CLI authentication issues" -ForegroundColor White
Write-Host "✓ Automatic deployments on git push" -ForegroundColor White
Write-Host "✓ Preview deployments for branches" -ForegroundColor White
Write-Host "✓ Built-in SSL certificate" -ForegroundColor White
Write-Host "✓ CDN distribution worldwide" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CURRENT STATUS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Backend:  https://care-integrity-api.onrender.com (LIVE)" -ForegroundColor Green
Write-Host "✓ Code:     Pushed to GitHub main branch" -ForegroundColor Green
Write-Host "✓ Build:    Verified working locally" -ForegroundColor Green
Write-Host "⏳ Frontend: Awaiting Vercel deployment" -ForegroundColor Yellow
Write-Host ""

Write-Host "Ready to proceed with dashboard deployment? (Press Enter)" -ForegroundColor Yellow
Read-Host
