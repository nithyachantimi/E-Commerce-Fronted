# Windows PowerShell Startup Script for E-Commerce Vite React Frontend
# Usage: .\start-frontend.ps1
$ErrorActionPreference = 'Stop'
if ($PSScriptRoot) { Set-Location -Path $PSScriptRoot }

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Starting E-Commerce Auth Frontend (http://localhost:5173)" -ForegroundColor Green
Write-Host " Connected API Base: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

npm.cmd run dev
