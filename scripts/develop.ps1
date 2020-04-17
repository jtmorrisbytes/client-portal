& .\scripts\install.ps1

Set-Variable -Name ENV -Value development
Set-Variable -Name NODE_ENV -Value development
Set-Variable -Name DEBUG -Value true
$cwd = (Get-Location).Path;
Start-Process -WorkingDirectory ("$cwd\client") powershell {

    Set-Location "npm run start";
}
Start-Process -WorkingDirectory ("$cwd\client") powershell {

    npm run testDev;
}
Start-Process -WorkingDirectory ("$cwd\server") powershell {
    npm run dev
}
Start-Process -WorkingDirectory ("$cwd\client") powershell {

    npm run testDev;
}
# Start-Process -WorkingDirectory ($cwd) -NoNewWindow powershell {
#     npx autogitter
# }