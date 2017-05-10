#import csvFunctions as CF
import re
import csv
import time

filename = 'asd.txt'

def askToRead(fileName):
    fileHandle = open(fileName, 'r')
    return fileHandle

def writeFile(dict):
    print("writing file")
    with open('asd.csv', 'w', newline='') as fh2:
        fileWriter = csv.writer(fh2,  quoting=csv.QUOTE_MINIMAL)
        fileWriter.writerow(header)
        for key, values in dict.items():
            for value in values:
                if value != "\n":
                    prnt = ""
                    prnt += key
                    prnt += "~"
                    prnt += dict2[key]
                    prnt += "~"
                    prnt += value
                    fileWriter.writerow(prnt.split("~"))

fh = askToRead(filename) 
dict = {}
dict2 = {}
header = ""
lines = fh.readlines()
for i in range(len(lines)):
    if i==0: 
        header = lines[i].split()
    if i > 1:
        key = lines[i].split()[0]
        try:
            p = re.compile("(?<=\d)\s*(?=[A-Z])") 
            teamList = p.split(lines[i])
            print(teamList[0]) 
            teamList2 = teamList[1].split("~")
            dathing = teamList[0]
            dict2[key] = dathing.split()[1]
            dict[key] = teamList2
        except: 
            print("oops")
            time.sleep(10)
    if i == len(lines)-1:
        writeFile(dict)
