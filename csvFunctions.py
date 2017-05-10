import csv 
import operator

def askToRead(fileName):
    #fileName = input("File name please: ")
    #fileName = 'Quotes_Region2.csv' 
    fileHandle = open(fileName, 'r')
    return fileHandle

def getLetters():
    dict = {}
    fileHandle = askToRead()
    number = input("Number of letters: ")
    for line in fileHandle:
        #print(line)
        try:
            letters = line[0:int(number)]
        except:
            letters = line
        try:
            dict[letters] += 1 
        except:
            dict[letters] = 1
    sortedDict = sorted(dict.items(), key=operator.itemgetter(1))
    fileHandle.close()
    return sortedDict

def writeLetters():
    #fileHandle = open('output.txt', 'w')
    sortedDict = getLetters()
    with open('output.csv', 'w', newline='') as fileHandle:
        fileWriter = csv.writer(fileHandle,  quoting=csv.QUOTE_MINIMAL)
        fileWriter.writerow(['Elements in this list: ']+[len(sortedDict)])
        for key, value in sortedDict:
            fileWriter.writerow([str(key)] + [str(value)])
        fileHandle.close()