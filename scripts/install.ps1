$loc = (Get-Location).Path

if((Test-Path "$loc\client\node_modules") -ne 1) {
    cd "$loc\client";
    yarn install
}
else {
    echo "client deps have already been installed"
}
if((Test-Path "$loc\server\node_modules") -ne 1) {
    cd "$loc\server";
    yarn install
}
else {
    echo "server deps have already been installed";
}
cd $loc;