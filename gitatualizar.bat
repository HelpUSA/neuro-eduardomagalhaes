@echo off
cd /d "%~dp0"
echo =============================
echo  Atualizando o repositorio Git
echo =============================

git add .
git commit -m "Atualizacao automatica - Plataforma Neuro Eduardo Magalhaes"
git push

echo =============================
echo       Concluido!
echo =============================
pause
