@echo off
REM 设置要执行的 Node.js 脚本路径
set NODE_SCRIPT_PATH="F:\静态技术栈-Beta\Github-docs\docs\script\AutoCreateDocs.js"

REM 设置工作目录（Node.js 脚本所在的文件夹）
set WORKING_DIR="F:\静态技术栈-Beta\Github-docs\docs\script"

REM 打印路径信息
echo NODE_SCRIPT_PATH: %NODE_SCRIPT_PATH%
echo WORKING_DIR: %WORKING_DIR%

REM 检查路径是否存在
if not exist %NODE_SCRIPT_PATH% (
    echo 错误：Node.js 脚本路径不存在！
    pause
    exit /b
)

if not exist %WORKING_DIR% (
    echo 错误：工作目录路径不存在！
    pause
    exit /b
)

REM 检查 Node.js 是否可用
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到 Node.js，请确保已安装并配置环境变量！
    pause
    exit /b
)

REM 打开命令行窗口并执行 Node.js 脚本
echo 正在执行 Node.js 脚本...
cmd /c "cd /d %WORKING_DIR% && node %NODE_SCRIPT_PATH%"

REM 延迟 3 秒后关闭窗口
timeout /t 1 >nul
exit