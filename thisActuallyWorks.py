import re 
import csv

fileHandle = open('XMLFile.txt', 'r')
attributeList = open('EmailAtt.csv', 'w', newline='')


for line in fileHandle:
    print(line)
    line = line.split()
    if len(line[1]) is not 'NULL':
        attributes = re.findall('[<][^/].*[>]',line[1])
        for attribute in attributes:
            attributeList.writerow(line[0]+', '+attribute+'\n')
attributeList.close()
