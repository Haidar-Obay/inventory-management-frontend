@echo off
echo Starting Brave with disabled security for development...
start "Brave Dev" "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --disable-web-security --disable-features=VizDisplayCompositor --user-data-dir="C:\temp\brave-dev-session" --allow-running-insecure-content --disable-site-isolation-trials --disable-features=BlockInsecurePrivateNetworkRequests
echo Brave started with disabled security features
pause
