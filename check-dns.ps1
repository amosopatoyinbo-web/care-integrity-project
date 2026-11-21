Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "        CHECKING DNS PROPAGATION STATUS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking DNS records for thecareintegrityproject.com..." -ForegroundColor Yellow
Write-Host ""

# Check A record
Write-Host "1. Checking A record (root domain)..." -ForegroundColor White
try {
    $aRecord = Resolve-DnsName -Name thecareintegrityproject.com -Type A -ErrorAction Stop
    if ($aRecord) {
        $ip = $aRecord | Where-Object { $_.Type -eq 'A' } | Select-Object -First 1 -ExpandProperty IPAddress
        if ($ip -eq '76.76.21.21') {
            Write-Host "   ✅ A record correct: $ip" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  A record found but wrong IP: $ip" -ForegroundColor Yellow
            Write-Host "   Expected: 76.76.21.21" -ForegroundColor Gray
            Write-Host "   Note: DNS may still be propagating..." -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⏳ A record not found yet (still propagating)" -ForegroundColor Yellow
}

Write-Host ""

# Check CNAME record
Write-Host "2. Checking CNAME record (www subdomain)..." -ForegroundColor White
try {
    $cnameRecord = Resolve-DnsName -Name www.thecareintegrityproject.com -Type CNAME -ErrorAction Stop
    if ($cnameRecord) {
        $cname = $cnameRecord | Where-Object { $_.Type -eq 'CNAME' } | Select-Object -First 1 -ExpandProperty NameHost
        if ($cname -like '*vercel*') {
            Write-Host "   ✅ CNAME record correct: $cname" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  CNAME found but unexpected: $cname" -ForegroundColor Yellow
            Write-Host "   Expected: cname.vercel-dns.com" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⏳ CNAME record not found yet (still propagating)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "        TESTING WEBSITE ACCESSIBILITY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test main domain
Write-Host "3. Testing https://thecareintegrityproject.com..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "https://thecareintegrityproject.com" -Method Get -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Site accessible! (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Message -like "*SSL*" -or $_.Exception.Message -like "*certificate*") {
        Write-Host "   ⏳ SSL certificate being provisioned..." -ForegroundColor Yellow
    } elseif ($_.Exception.Message -like "*could not be resolved*") {
        Write-Host "   ⏳ Domain not resolving yet (DNS propagating)" -ForegroundColor Yellow
    } else {
        Write-Host "   ⏳ Not accessible yet: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test www domain
Write-Host "4. Testing https://www.thecareintegrityproject.com..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "https://www.thecareintegrityproject.com" -Method Get -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Site accessible! (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Message -like "*SSL*" -or $_.Exception.Message -like "*certificate*") {
        Write-Host "   ⏳ SSL certificate being provisioned..." -ForegroundColor Yellow
    } elseif ($_.Exception.Message -like "*could not be resolved*") {
        Write-Host "   ⏳ Domain not resolving yet (DNS propagating)" -ForegroundColor Yellow
    } else {
        Write-Host "   ⏳ Not accessible yet: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "        VERCEL DOMAIN STATUS" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "Checking Vercel domain configuration..." -ForegroundColor White
Write-Host ""
