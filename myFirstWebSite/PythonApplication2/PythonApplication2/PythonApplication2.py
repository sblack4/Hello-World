#! python 
import xlsxwriter as xlw
import re 
import pandas as pd
# DEPENDENCIES: pandas, re, xlsxwriter,  # TODO: add GUI

def getNotebook(months):
	print('\n FIRST! Make sure the excel file is in the same folder as this file, the output will be placed here too \n \n Second, enter notebook name as in Karlies great workbook.xlsx') # 'GSA_TrackMaster.xlsm' 
	notebook = input('Enter Notebook Name: ')		# TODO: add try/catch for names
	notebook = 'GSA_TrackMaster.xlsm' 
	xls = pd.ExcelFile(notebook)
	
	reg = re.compile('.*[\.]')
	new_notebook = re.search(reg, notebook)
   
	new_notebook = str(new_notebook.group(0)) 
	new_notebook = str(new_notebook.replace('.',''))+' FeesReport.xlsx'
	
	wb = xlw.Workbook(new_notebook)
	for month in months:
		wb.add_worksheet(month)
	wb.close()
	
	xls2 = pd.ExcelWriter(new_notebook)
	return xls, xls2

	
	
def stringToCurrency(df, MonthCol):
	try:
		#df[MonthCol].convert_objects(convert_numeric=True).dropna()
		
		df[MonthCol] = df[MonthCol].replace('X', 0).astype(float).fillna(0.0)
		#df = df.loc[(not isinstance(df[MonthCol], str))]
		df = df.loc[(df[MonthCol] > 0)]
		bool = True 
	except Exception as oops: 
		# print("\n !!!Invalid Charecters in IFF field. \n ... \n ... \n ...Getting rid of X's \n")

		print(oops)

		
		bool = False 
		df = pd.DataFrame()
	return df, bool 



def insertColumns(df, month, contract):
	df.insert(0,'Order#',['' for i in range(0, len(df.index))])
	df.insert(2, 'Time Frame', [month for i in range(0,len(df.index))])
	df.insert(4, 'Contract', [contract for i in range(0,len(df.index))])
	df.insert(5,'PO #',['' for i in range(0, len(df.index))])
	colOrder = ['Order#', 'Teaming Partner', 'Time Frame',month, 'Contract', 'PO #', 'Product']
	df = df[colOrder]
	return df
	
	
def contractsDict(xls):
    contracts = dict()
    for sheet in xls.sheet_names:
        contracts[sheet] = dict()
        try: 
            df = xls.parse(sheet, header=-1)
            custs = df[df[df.columns[0]].str.contains('Cust')==True].index.tolist()
            #print(df.columns)
            #print(str(sheet)+ " \n "+ str(custs) +" \n ")

            for i in range(0,len(custs)):
                if i < 1:
                    #print(df.columns[1])
                    contracts[sheet].update({custs[i]:df.columns[1]})
                else:
                    #print(df[df.columns[1]][custs[i]-2])
                    contracts[sheet].update({custs[i]:df[df.columns[1]][custs[i]-2]})
        except Exception as oops:
            print(oops)
    return(contracts)


def contractDF(xls, xls2, months):
	monthsD = dict(zip(months, [0 for i in range(0,len(months))]))
	sheets = xls.sheet_names
	contDict = contractsDict(xls)
	for sheet in sheets: 
		#print(sheet)
		for monthIFF in months:
			#print(monthIFF)
			contracts = contDict[sheet]
			contracts_id = list(contDict[sheet].keys())
			
			contracts_id.sort()
			
			for i in range(0, len(contracts_id)): 
				if i < len(contracts_id)-1:
					end = contracts_id[i+1] - (contracts_id[i] + 5)
				else:
					end = 1000
					
				dfm = pd.DataFrame()
				df = pd.DataFrame()
				
				
				dfm = xls.parse(sheet, header=contracts_id[i]+1)
				dfm = dfm.iloc[(dfm.index < end)] 			# df = df.loc[(df[MonthCol] > 0)&(df.index<end)]
				#print(dfm, contracts[contracts_id[i]],contracts_id[i],end, contracts_id)
				df, bool = stringToCurrency(dfm, monthIFF)
				if any(monthIFF in s for s in dfm.columns) and bool:
			
					df = df.loc[:, ['Teaming Partner', 'Product', monthIFF]]
					df = insertColumns(df, monthIFF, contracts[contracts_id[i]])
					df.to_excel(xls2, sheet_name=monthIFF, startrow=monthsD[monthIFF], header=(monthsD[monthIFF]==0))
					monthsD[monthIFF] += len(df.index)+1
				else:
					pass


def main():
	months = ['January IFF',	'February IFF',	'March IFF',	'April IFF',	'May IFF',	'June IFF',	'July IFF',	'August IFF',	'September IFF',	'October IFF',	'November IFF',	'December IFF']
	xls, xls2 = getNotebook(months)
	print("Loading... will tell you when done.")
	contractDF(xls, xls2, months)
	print("Done! ")
	
main()
