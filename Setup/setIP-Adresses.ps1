$Server = Read-Host -Prompt 'Bitte geben Sie die IP des Rechners ein'


$OldIP = Get-Content -Path .\old_ip.conf -TotalCount 1

$OldIP = $OldIP -replace "`t|`n|`r",""
$Server = $Server -replace "`t|`n|`r",""


$Server | Set-Content .\old_ip.conf


(Get-Content ..\Admin_Panel\beamer.html).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\Admin_Panel\beamer.html
(Get-Content ..\Admin_Panel\lib\users.js).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\Admin_Panel\lib\users.js
(Get-Content ..\Admin_Panel\lib\settings.js).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\Admin_Panel\lib\settings.js
(Get-Content ..\Admin_Panel\lib\overview.js).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\Admin_Panel\lib\overview.js
(Get-Content ..\Admin_Panel\lib\login.js).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\Admin_Panel\lib\login.js

(Get-Content ..\GUI\js\index.js).replace('var baseURL = "http://'+ $OldIP + ':3000";', 'var baseURL = "http://' + $Server + ':3000";') | Set-Content ..\GUI\js\index.js



Write-Host "`nFertig! Bitte Taste drücken...";
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")