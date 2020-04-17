$cwd = (Get-Location).Path

& "$cwd\scripts\install.ps1"
Set-Variable -Name ENV -Value "testing"
Set-Variable -Name NODE_ENV -Value "testing"
Set-Variable -Name DEBUG -Value true

Write-Output "Starting client tests"
Start-Process -WorkingDirectory ("$cwd\client") powershell {
    npm run test;
}
Write-Output "Starting server tests"
Start-Process -WorkingDirectory ("$cwd\server") powershell {
    npm run test;
}
