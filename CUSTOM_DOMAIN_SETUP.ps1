# ========================================
# CUSTOM DOMAIN SETUP GUIDE
# Connect thecareintegrityproject.com to Vercel
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CUSTOM DOMAIN SETUP FOR VERCEL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 1: Using Vercel Dashboard (RECOMMENDED)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Step 1: Add Domain to Vercel Project" -ForegroundColor Cyan
Write-Host "  1. Go to: https://vercel.com/amosopatoyinbo-web/care-integrity-project-live/settings/domains" -ForegroundColor White
Write-Host "  2. In the 'Domains' section, enter: thecareintegrityproject.com" -ForegroundColor White
Write-Host "  3. Click 'Add'" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Add www Subdomain (Optional but Recommended)" -ForegroundColor Cyan
Write-Host "  1. Click 'Add Domain' again" -ForegroundColor White
Write-Host "  2. Enter: www.thecareintegrityproject.com" -ForegroundColor White
Write-Host "  3. Click 'Add'" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Configure DNS Records" -ForegroundColor Cyan
Write-Host "  Vercel will show you the DNS records to add. You'll need to:" -ForegroundColor White
Write-Host ""
Write-Host "  Go to your domain registrar (where you bought the domain)" -ForegroundColor White
Write-Host "  Add these DNS records:" -ForegroundColor White
Write-Host ""
Write-Host "  For Root Domain (thecareintegrityproject.com):" -ForegroundColor Yellow
Write-Host "    Type:  A" -ForegroundColor Gray
Write-Host "    Name:  @" -ForegroundColor Gray
Write-Host "    Value: 76.76.21.21" -ForegroundColor Green
Write-Host ""
Write-Host "  For www Subdomain (www.thecareintegrityproject.com):" -ForegroundColor Yellow
Write-Host "    Type:  CNAME" -ForegroundColor Gray
Write-Host "    Name:  www" -ForegroundColor Gray
Write-Host "    Value: cname.vercel-dns.com" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Wait for DNS Propagation" -ForegroundColor Cyan
Write-Host "  - DNS changes can take 24-48 hours to propagate worldwide" -ForegroundColor White
Write-Host "  - Usually happens within 1-2 hours" -ForegroundColor White
Write-Host "  - Vercel will automatically verify and provision SSL" -ForegroundColor White
Write-Host ""

Write-Host "Step 5: Set Primary Domain" -ForegroundColor Cyan
Write-Host "  1. Back in Vercel Domains settings" -ForegroundColor White
Write-Host "  2. Click the three dots next to thecareintegrityproject.com" -ForegroundColor White
Write-Host "  3. Select 'Set as Primary Domain'" -ForegroundColor White
Write-Host "  4. This makes it the default URL shown in search results" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "OPTION 2: Using Vercel CLI" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "  # Add root domain" -ForegroundColor Gray
Write-Host "  vercel domains add thecareintegrityproject.com care-integrity-project-live" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # Add www subdomain" -ForegroundColor Gray
Write-Host "  vercel domains add www.thecareintegrityproject.com care-integrity-project-live" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # List all domains" -ForegroundColor Gray
Write-Host "  vercel domains ls" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "AFTER DNS IS CONFIGURED" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. Update Backend CORS" -ForegroundColor Yellow
Write-Host "   Go to Render dashboard and add your domain to ALLOWED_ORIGINS:" -ForegroundColor White
Write-Host "   https://thecareintegrityproject.com,https://www.thecareintegrityproject.com" -ForegroundColor Green
Write-Host ""

Write-Host "2. Update Social Meta Tags (Optional)" -ForegroundColor Yellow
Write-Host "   Update index.html with your custom domain for better SEO" -ForegroundColor White
Write-Host ""

Write-Host "3. Verify SSL Certificate" -ForegroundColor Yellow
Write-Host "   Vercel automatically provisions and renews SSL certificates" -ForegroundColor White
Write-Host "   Visit https://thecareintegrityproject.com to verify" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMMON DOMAIN REGISTRARS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GoDaddy: https://dcc.godaddy.com/manage/dns" -ForegroundColor White
Write-Host "Namecheap: https://ap.www.namecheap.com/domains/list/" -ForegroundColor White
Write-Host "Google Domains: https://domains.google.com/registrar" -ForegroundColor White
Write-Host "Cloudflare: https://dash.cloudflare.com" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "BENEFITS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Professional custom domain" -ForegroundColor Green
Write-Host "✓ Free SSL certificate (HTTPS)" -ForegroundColor Green
Write-Host "✓ Automatic certificate renewal" -ForegroundColor Green
Write-Host "✓ Better SEO and branding" -ForegroundColor Green
Write-Host "✓ Vercel subdomain still works as backup" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to add your domain? (Press Enter to continue)" -ForegroundColor Yellow
Read-Host
