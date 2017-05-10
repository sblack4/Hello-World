#import re 

#print("Hello World, I'm Back") 

#f = open('EmailAtt.txt', 'r')
#AttributeList = open('EmailAtt.csv', 'w', newline='')

#def AttToList():
#	AttList = []
#	for line in f:
#		newline = line.split()
#		#print(newline[1])
#		for att in newline[1].split('~'):
#			#print(att)
#			if att not in Attirbutes:
#				AttList.append(att)

#def AttToTxt():
#	Attirbutes = []
#	AttList = open('AttList.txt', 'w')
#	for line in f:
#		newline = line.split()
#		#print(newline[1])
#		for att in newline[1].split('~'):
#			#print(att)
#			if att not in Attirbutes:
#				Attirbutes.append(att)
#				AttList.writelines(att+'\n')
#	AttList.close()
#	print("done")

#import csv
#with open('eggs.csv', 'w', newline='') as csvfile:
#    spamwriter = csv.writer(csvfile, delimiter=' ',
#                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
#    spamwriter.writerow(['Spam,'] * 5 + ['Baked Beans \n']*5)
#    spamwriter.writerow(['Spam', 'Lovely Spam', ' Wonderful Spam'])

import re 
import csv #Import Modules 

def csvWriter():
    file = input("Enter file name you would like to read from (must be in same folder as this program): ")
    wFile = input("Enter file name you would like to write to: ")
    fileHandle = open(file, 'r')       #Open file to read from 
    with open(wFile, 'w', newline='') as csvfile:      # Open file to write to 
        attWriter = csv.writer(csvfile,  quoting=csv.QUOTE_MINIMAL)     #Open CSV writer 
        for line in fileHandle:
            
            line = line.split()
            print(len(line))
            if line[0] != 'NULL':           # Split every line and if it's not 'NULL' split it at the ones
                #print(line[1])
                noOnes = line[0]
                noOnes = noOnes.split('1')
                #print(noOnes)
                for attributes in noOnes:
                    #print(attributes)
                    try:
                        attribute = re.findall('[<][^/].*[>]', attributes)
                        #print(attribute)
                        att = attribute[0]
                        att = att[1:-1]
                        att = att.replace('_x0020_', ' ')  #Gets rid of one dirty charecter, need to replace others (e.g. _x002F_ and _0026_)
                        att = att.replace('_x0031_', '1')
                        att = att.replace('_x0034_', '4')
                        att = att.replace('_x002F_', '/')
                        #print(att)
                        attWriter.writerow([str(line[0])]+  [att])
                    except:
                        pass
        attributeList.close()

def dirtFinder():
    with open('XMLfile2.txt', 'r') as fh:
        dirtyChars = set()
        for line in fh:
            try: 
                dirt = re.findall('[_]x00..[_]', line)
                dirtyChars.update(dirt)
                #if dirt not in dirtyChars:
                #    dirtyChars.extend(dirt)
            except: 
                pass
        print(dirtyChars)

#dirtFinder()

csvWriter() 




