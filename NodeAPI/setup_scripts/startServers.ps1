Remove-Item temp -Recurse -Force -ErrorAction Ignore
New-Item -ItemType directory -Path temp | Out-Null

#git clone 'https://github.com/chrisigasser/guidemanagement' -b 'NodeAPI_Development' temp


start powershell "& 'C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe'"

node temp/singlefileNode/index.js

$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")