del /Y "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\src"
del /Y "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\public"
xcopy /e /i /Y "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_DEV\src" "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\src"
xcopy /e /i /Y "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_DEV\public" "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\public"
xcopy /f /Y "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\config.js"  "D:\inetpub\wwwroot\Webs\BonusPrime\BP_FRONT_INT\src\config.js"

