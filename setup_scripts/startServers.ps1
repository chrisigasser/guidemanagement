start powershell "& 'C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe'"

node .\..\singlefileNode/index.js

$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")