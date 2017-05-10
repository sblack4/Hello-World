# -*- coding: utf-8 -*-
"""
Created on Fri Aug 19 13:20:26 2016

@author: sblack

see here: http://docs.zoomdata.com/activities-log-quick-reference-sheet$ACTIVITY_ACCOUNT 

ENABLE: 
curl -i --basic -k -u supervisor:5herlock -XPUT 'https://zoomdata:8443/zoomdata/service/system/activity/FILE' -H "Content-Type: application/json" --data 'true' 

IS IT ENABLED?:
 curl -i --basic -k -u supervisor:5herlock -XGET 'https://zoomdata:8443/zoomdata/service/system/activity/FILE'
 
 ENABLE ACTIVITY CHART LOGGING: 
 curl -i --basic -k -u supervisor:5herlock -XPUT 'https://zoomdata:8443/zoomdata/service/system/activity/type/VIS_COMMAND/FILE' -H "Content-Type: application/json" --data 'true'

 ENABLE ACTIVITY DATA LOGGING: 
 curl -i --basic -k -u supervisor:5herlock -XPUT 'https://zoomdata:8443/zoomdata/service/system/activity/type/VIS_DATA/FILE' -H "Content-Type: application/json" --data 'true'



I done got myself one 'o them zoomdata-activity.log 's.  with is I logged VIS_COMMAND and VIS_DATA

see: http://docs.zoomdata.com/activity-logging-v2-2 for info on logg'n
and see: http://docs.zoomdata.com/activities-log-quick-reference-sheet-v2-2  for types 'o logg'n

Each log file goes like this
List(of lines/logged events) -> String(actually a date-time and a dictionary) -> Dictionary

"""
headers = ['eventRequest', 'eventDate',	'user',	'accountId',	'ip',	'status',	'userRoles',	'userGroups',	'activityType',	'userType',	'cid',	'actionStartedOn',	'duration',	'request', 'payload']

def getDictionary(logString):
	import sys
	loglist = logString.split(' {', 1)
	try: 
		response = '{ "eventRequest":"'+loglist[0]+'",'+loglist[1]
		return response
	except: 
		e = sys.exc_info()[0]
		print("ERROR: \n", e )
		return {}
		
def initDict():
	logDict = {}
	for header in headers:
		logDict[header] = []
	print(logDict)
	return logDict
		

def organizeData(logDict, dict_):
	for header in headers:
		logDict[header].append(dict_.get(header, 0))
		
		
def readLog(logname='zoomdata-activity.log'):
	import json
	with open(logname) as logFile:
#		print(logFile)
		data = logFile.readlines()
		logDict = initDict()
		i = 0
		for line in data:
			dict_ = getDictionary(line)
#			print(dict_)
			print(type(dict_))
			dict_ = json.loads(str(dict_))
#			print(dict_)
			print(type(dict_))
			organizeData(logDict, dict_)
#			print(dict_)
#			dfDict["df{0}".format(i)] = df
			i += 1
			print(i)
#			for key, value in dict_.items():
#				print('Key: ', key, '\t\t\t Value: ', value)
	return logDict

def writeCsv(logDict):
	import datetime
	fileName = 'Activity Log '+str(datetime.datetime.now()).split('.')[0].replace(':', '-')+'.csv'
	print(fileName)	
	with open(fileName, 'w') as file:
		for header in headers:
#			if header=='payload':
#				continue
			file.write(str(header)+',')
		file.write('\n')
		for i in range(len(logDict['eventRequest'])):
			for header in headers:
#				if header=='payload':
#					continue
				file.write('"'+str(logDict[header][i])+'"'+',')
			file.write('\n')

if __name__=='__main__':
	logDict = readLog()
	writeCsv(logDict)
