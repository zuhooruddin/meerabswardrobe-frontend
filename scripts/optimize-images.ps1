# Image Optimization Script for Windows
# Chitral Hive - Performance Enhancement
#
# Prerequisites:
#   1. Python 3.x installed
#   2. Django project set up
#   3. Pillow library installed (pip install Pillow)
#
# Usage:
#   .\optimize-images.ps1
#   .\optimize-images.ps1 -Path "media\slider" -Quality 85
#   .\optimize-images.ps1 -DryRun

param(
    [string]$Path = "media",
    [int]$Quality = 85,
    [int]$MaxWidth = 1920,
    [int]$MaxHeight = 1080,
    [switch]$Backup,
    [switch]$DryRun
)

# Colors for output
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"
$InfoColor = "Cyan"

Write-Host "========================================" -ForegroundColor $InfoColor
Write-Host "  Chitral Hive Image Optimization" -ForegroundColor $InfoColor
Write-Host "========================================" -ForegroundColor $InfoColor
Write-Host ""

# Check if we're in the right directory
$djangoDir = "..\..\chitralhivedjango"
if (Test-Path $djangoDir) {
    Push-Location $djangoDir
    Write-Host "✓ Found Django project" -ForegroundColor $SuccessColor
} else {
    Write-Host "✗ Django project not found at: $djangoDir" -ForegroundColor $ErrorColor
    Write-Host "Please run this script from: E:\chitralhive\chitralhive\scripts\" -ForegroundColor $WarningColor
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python installed: $pythonVersion" -ForegroundColor $SuccessColor
} catch {
    Write-Host "✗ Python not found" -ForegroundColor $ErrorColor
    Write-Host "Please install Python 3.x from https://www.python.org/" -ForegroundColor $WarningColor
    exit 1
}

# Check if Pillow is installed
$pillowCheck = python -c "import PIL; print(PIL.__version__)" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Pillow library installed: $pillowCheck" -ForegroundColor $SuccessColor
} else {
    Write-Host "✗ Pillow library not found" -ForegroundColor $ErrorColor
    Write-Host "Installing Pillow..." -ForegroundColor $InfoColor
    pip install Pillow
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install Pillow" -ForegroundColor $ErrorColor
        exit 1
    }
    Write-Host "✓ Pillow installed successfully" -ForegroundColor $SuccessColor
}

Write-Host ""
Write-Host "========================================" -ForegroundColor $InfoColor
Write-Host "  Starting Image Optimization" -ForegroundColor $InfoColor
Write-Host "========================================" -ForegroundColor $InfoColor
Write-Host "Path: $Path" -ForegroundColor $InfoColor
Write-Host "Quality: $Quality" -ForegroundColor $InfoColor
Write-Host "Max Size: ${MaxWidth}x${MaxHeight}" -ForegroundColor $InfoColor
Write-Host "Backup: $Backup" -ForegroundColor $InfoColor
Write-Host "Dry Run: $DryRun" -ForegroundColor $InfoColor
Write-Host ""

# Build the command
$command = "python manage.py optimize_images --path=$Path --quality=$Quality --max-width=$MaxWidth --max-height=$MaxHeight"

if ($Backup) {
    $command += " --backup"
}

if ($DryRun) {
    $command += " --dry-run"
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor $WarningColor
    Write-Host ""
}

# Execute the command
Write-Host "Executing: $command" -ForegroundColor $InfoColor
Write-Host ""

Invoke-Expression $command

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor $InfoColor

if ($exitCode -eq 0) {
    Write-Host "  ✓ Optimization Complete!" -ForegroundColor $SuccessColor
    Write-Host "========================================" -ForegroundColor $InfoColor
    Write-Host ""
    
    if (-not $DryRun) {
        Write-Host "Next Steps:" -ForegroundColor $InfoColor
        Write-Host "1. Test images load correctly on the website" -ForegroundColor $InfoColor
        Write-Host "2. Update image references in Django admin" -ForegroundColor $InfoColor
        Write-Host "3. Run Lighthouse audit to verify improvements" -ForegroundColor $InfoColor
        Write-Host "4. If satisfied, delete original PNG/JPG files" -ForegroundColor $InfoColor
        Write-Host ""
        Write-Host "Backups location: $Path\backups" -ForegroundColor $WarningColor
    } else {
        Write-Host "This was a dry run. Run without -DryRun to apply changes." -ForegroundColor $WarningColor
    }
} else {
    Write-Host "  ✗ Optimization Failed" -ForegroundColor $ErrorColor
    Write-Host "========================================" -ForegroundColor $InfoColor
    Write-Host ""
    Write-Host "Please check the error messages above." -ForegroundColor $WarningColor
}

Write-Host ""
Write-Host "Documentation:" -ForegroundColor $InfoColor
Write-Host "- Full Report: chitralhive\PERFORMANCE_OPTIMIZATION_REPORT.md" -ForegroundColor $InfoColor
Write-Host "- Quick Start: chitralhive\QUICK_START_OPTIMIZATION.md" -ForegroundColor $InfoColor
Write-Host "- Summary: chitralhive\OPTIMIZATION_SUMMARY.md" -ForegroundColor $InfoColor
Write-Host ""

Pop-Location





