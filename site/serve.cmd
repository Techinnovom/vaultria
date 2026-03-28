@echo off
cd /d "%~dp0"
echo.
echo  Serving this folder as http://localhost:8765/
echo  Textbook: http://localhost:8765/pages/textbook/index.html
echo  Press Ctrl+C to stop.
echo.
python -m http.server 8765
