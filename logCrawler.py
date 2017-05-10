#SBlack python3.52,  "the Logg Crawler"
""" A simple script to look for stuff in a log file """
import re

def getInput():
    """ get input and open file """
    # fileName = input("Input file name: ")
    fileName = 'zoomdata-access.log'                 # for testing
    fileHandle = open(fileName, 'r')
    return fileName, fileHandle


def regexLines(fileHandle):
    """ go line by line and get the keys add them and count their frequency in a dict """
    searchForThisText = 'bookmarks'
    regexExpression = re.compile('.('+searchForThisText+').*')
    frequencyDict = {} 
    ### REGEX FOR TESTING 
#    lineTest = '/zoomdata/service/bookmarks/57ab8153c2dcf35de83b8966?_'
#    print(lineTest)
#    matchObj = regexExpression.search(lineTest)
#    if matchObj:
#        print(matchObj.group(0))
    for line in fileHandle:
        matchObj = regexExpression.search(line)
        if matchObj:
            print('Line, match: ')
            print(matchObj.group(0))
            match2 = re.search('([0-9])+[0-9a-z]+', matchObj.group(0), re.I)
            print(match2.group(0))
            print('\n')
#            print(matchObj.group(0))
            frequencyDict[str(match2.group(0))] = frequencyDict.get(str(match2.group(0)), 1) + 1
    print("\n end of doc, writing to csv as: ")
    ### PRINTS RESULTS TO CONSOLE FOR IMMEDIATE GRATIFICATION 
    for key in frequencyDict.keys():
        print(key, ' : ',  frequencyDict[key])
    return frequencyDict
    
def writeDict(frequencyDict, fileName):
    """ writes frequency dictionary to csv """
    import csv
    outputFileName = 'OUTPUT OF '+fileName.split('.')[0]+'.csv'
    print(outputFileName+'\n')
    with open(outputFileName, 'w', newline='') as csv_file:
        csvHandle = csv.writer(csv_file, delimiter=' ', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        # writer.writeheader()
        for key, value in frequencyDict.items():
            csvHandle.writerow([str(key)+','+str(value)])
    print("csv written as "+outputFileName)


def getLines(fileHandle):
    """ go line by line """
    searchForThisText = 'bookmarks'
    regexExpression = re.compile('.('+searchForThisText+').*')
    frequencyList = [] 
    ### REGEX FOR TESTING 
#    lineTest = '/zoomdata/service/bookmarks/57ab8153c2dcf35de83b8966?_'
#    print(lineTest)
#    matchObj = regexExpression.search(lineTest)
#    if matchObj:
#        print(matchObj.group(0))
    for line in fileHandle:
        matchObj = regexExpression.search(line)
        if matchObj:
            frequencyList.append(line)
            print(matchObj)
    print("\n end of doc, writing to csv as: ")
    ### PRINTS RESULTS TO CONSOLE FOR IMMEDIATE GRATIFICATION 
    for line in frequencyList:
        print(line)
    return frequencyList

def writeList(frequencyList, fileName):
    """ writes list to text file """
    outputFileName = 'OUTPUT OF '+fileName.split('.')[0]+'.txt'
    fileHandle = open(outputFileName, 'w')
    for item in frequencyList:
        fileHandle.write(item)
    print(".txt file written as "+outputFileName)
    fileHandle.close()

    
if __name__ == "__main__":
    fileName, fileHandle = getInput()
    print("REGEXLINES: ");   frequencyDict = regexLines(fileHandle)
    writeDict(frequencyDict, fileName)
#    print("\n\n\n GETLINES: "); frequencyList = getLines(fileHandle)
#    writeList(frequencyList, fileName)
