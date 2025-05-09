# PowerShell script to start the project
Write-Host "Setting up and starting the project..." -ForegroundColor Green

# Change to the project directory
Set-Location -Path "project"

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev 