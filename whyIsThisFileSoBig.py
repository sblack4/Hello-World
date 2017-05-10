# -*- coding: utf-8 -*-
"""
Created on Thu Aug 18 10:40:35 2016

@author: sblack
"""

import re

toRegex = r'^2016-08-16'

regex = re.compile(toRegex)

fhr = open('mongodView.log', 'r')
fhw = open('mongodToday.log', 'w')

for line in fhr:
    if regex.match(line):
        fhw.write(line)
        
fhr.close()
fhw.close() 
print('Done')

"""
    {"timestamp":"2016-08-16 20:07:55.068","status":500,"error":"Internal Server Error","exception":"org.springframework.dao.DataAccessResourceFailureException","message":"org.springframework.dao.DataAccessResourceFailureException: Timed out after 10000 ms while waiting to connect. Client view of cluster state is {type=Unknown, servers=[{address=localhost:27017, type=Unknown, state=Connecting, exception={com.mongodb.MongoException$Network: Exception opening the socket}, caused by {java.net.ConnectException: Connection refused}}]; nested exception is com.mongodb.MongoTimeoutException: Timed out after 10000 ms while waiting to connect. Client view of cluster state is {type=Unknown, servers=[{address=localhost:27017, type=Unknown, state=Connecting, exception={com.mongodb.MongoException$Network: Exception opening the socket}, caused by {java.net.ConnectException: Connection refused}}]","path":"/zoomdata/"}
"""

	