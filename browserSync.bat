Rem @echo off
pushd %~dp0

SET ARG_ONE=%1
if [ARG_ONE] == [] SET ARG_ONE = "*" 

browser-sync start --server --files ARG_ONE %2 %3 

popd