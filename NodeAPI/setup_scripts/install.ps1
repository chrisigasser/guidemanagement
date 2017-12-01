$install = 0
try {
    node --help 2>&1 | Out-Null -ErrorAction stop
    $install = 0
}
catch {
    $install = 1
}

if($install) {
    Write-Host "Installing NodeJs";
    Start-Process msiexec.exe -Wait -ArgumentList '/i installers\node.msi /qr'
    Write-Host "NodeJS installation completed";
}
else {
    Write-Host "NodeJS is already installed. Installation will be skipped";
}

$install = 0
try {
    & 'C:\Program Files\MongoDB\Server\3.4\bin\mongo.exe' --help 2>&1 | Out-Null -ErrorAction stop
    $install = 0
}
catch {
    $install = 1
}

if($install) {
    Write-Host "Installing MongoDB";
    Start-Process msiexec.exe -Wait -ArgumentList '/i installers\mongodb.msi /qr'
    Write-Host "MongoDB installation completed";
}
else {
    Write-Host "MongoDB is already installed. Installation will be skipped";
}

$exists = Test-Path C:\data\db
if($exists -eq $false) {
    Write-Host "Create db folder for MongoDB";
    new-item C:\data\db -itemtype directory | Out-Null
}

if(!($env:Path -split ";" -contains "C:\Program Files\MongoDB\Server\3.4\bin\")) {
    $env:Path += ";C:\Program Files\MongoDB\Server\3.4\bin\"
    [Environment]::SetEnvironmentVariable("PATH", $env:Path, "User")
    Write-Host "Added mongo to PATH variable";
}
else {
    Write-Host "PATH Variable already contains mongo";
}

Write-Host "`nPress any key to finish..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")