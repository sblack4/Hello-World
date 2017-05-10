#import csvFunctions as CF

filename = 'CE_2016-06-01.csv'

def askToRead(fileName):
    #fileName = input("File name please: ")
    #fileName = 'Quotes_Region2.csv' 
    fileHandle = open(fileName, 'r')
    fileHandle.next()
    fileHandle.next()
    return fileHandle

fileHandle = askToRead(filename)

fileHandle.next()
filHandle.next()

print(fileHandle.next())