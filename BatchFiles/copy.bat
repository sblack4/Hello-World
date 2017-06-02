
@ECHO OFF

SET source = source/
SET destination = destination/

ECHO deleting files: 
DIR destination
DEL /Y /V destination 

ECHO copying files:
REM CD source\
DIR source
ECHO ...
COPY /V /Y source destination
ECHO ... && ECHO files copied :)

@ECHO ON

