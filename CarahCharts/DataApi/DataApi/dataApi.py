import pypyodbc
import pandas as pd
import numpy as np
import json 

def Connect():
	connection = pypyodbc.connect('Driver={SQL Server Native Client 11.0};'
									'Server=AWING;'
									'Database=CARAHSOFT;'
									'Trusted_Connection=yes;') 

	DF = pd.read_sql_query("SELECT  Users.UserName,  SUM([CallsIn] + [CallsOut] + [CallsInTime]/60.0 + [CallsOutTime]/60.0) AS CPM, SUM([EmailIntSent] + [EmailIntRec] +[EmailExtSent] + [EmailExtRec]) AS [Total Email]  \
	FROM [Carahsoft].[dbo].[UserMetrics] \
	LEFT OUTER JOIN UsersAll AS Users ON UserMetrics.User_ID = Users.User_ID \
	LEFT OUTER JOIN Organizations ON UserMetrics.Organization_ID = Organizations.Organization_ID\
	WHERE UserName IN ('Amanda Nieves', 'Amos Kim' , 'Christopher Tolbert ' , 'Danielle Allen' , 'Edward Walinsky' , 'Elizabeth Heinz', 'Eric Reynolds', 'Hiwa Sheikh', 'Larissa Carroll', 'Laura Howton' , 'Leslie Ramos', 'Matthew Lanham', 'Michael Adams', 'Nicholas Cumba', 'Nick McGuiness', 'Nykolaus Pinnock', 'Robert Miller')\
	AND Date > EOMONTH(GETDATE(), -2) AND DATENAME(dw, Date) NOT IN ('Saturday', 'Sunday')\
	GROUP BY UserName", connection)


	dfj = DF.reset_index().to_json(orient='records')
	
	return dfj


from flask import Flask
from flask_restful import Resource, Api 
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
app.config['DEBUG'] = True

# CORS SUPPORT 
app.config['CORS_ALLOW_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/*": {"origins": "*"}}

cors = CORS(app)

class Dep(Resource):
	def get(self):
		query = Connect()
		if query:
			return query
		else:
			return 'NOPE NOPE NOPE' 

api.add_resource(Dep, '/data')

#if __name__  == "__main__":
#	app.run()
