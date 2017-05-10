import re 
import csv #Import Modules 
from collections import defaultdict

def csvWriter():
    file = input("Enter file name you would like to read from (must be in same folder as this program): ")
    wFile = input("Enter file name you would like to write to: ")
    fileHandle = open(file, 'r')       #Open file to read from 
    with open(wFile, 'w', newline='') as csvfile:      # Open file to write to 
        attWriter = csv.writer(csvfile,  quoting=csv.QUOTE_MINIMAL)     #Open CSV writer 
        outputDictionary = defaultdict(int)
        for line in fileHandle:
            
            line = line.split()
            print(len(line))
            if line[0] != 'NULL':           # Split every line and if it's not 'NULL' split it at the ones
                #print(line[1])
                noOnes = line[0]
                noOnes = noOnes.split('1')
                #print(noOnes)
                for attributes in noOnes:
                    try:
                        attribute = re.findall('[<][^/].*[>]', attributes)
                        outputDictionary[attribute] += 1
                        attribute = re.findall('[<][^/].*[>]', attributes)
                        #print(attribute)
                        att = attribute[0]
                        att = att[1:-1]
                        att = att.replace('_x0020_', ' ')  #Gets rid of one dirty charecter
                        att = att.replace('_x0031_', '1')
                        att = att.replace('_x0034_', '4')
                        att = att.replace('_x002F_', '/')

                    except:
                        pass
        iterDict = iter(sorted(outputDictionary.items()))
        for key_value in iterDict:
            attWriter.writerow(key_value)



csvWriter() 
