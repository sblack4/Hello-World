/*================================ LOAD ================================*/
LOAD
	/* ========== Users ========== */
	SalesRep
	, Owner
    , Name AS [Organization]
	/* ========== Orders (Occs) ========== */
	, MONEY(TotalOrder, '$#,##0') AS [TotalOrder]
	, Team
	, Vendor
	, Reseller
    , DateBooked
	, DATE(CreateDate) AS [Create Date]
    , DATE(CreateDate, 'WWWW') AS [Create Week]
    , TEXT(DATE(CreateDate, 'MMMM')) AS [Create Month]
    , DATE(CreateDate, 'YYYY') AS [Create Year]
    , TEXT(DATE(CreateDate, 'MMMM, YYYY')) AS [Month-Year]
	, Status
	, Region1
	, Region2
	, Region3
	, Region4
	, Region5
	, MainAgency
	, ContractType
	, VendorRep1
	, ResellerRep1
	/* ========== Quotes ========== */
	, MONEY(ForecastAmount,'$#,##0') AS [ForecastAmount]
	, ProbabilityNumber
	/* ========== Customers ========== */
	, FirstName
	, LastName
	, Agency
	, Email
	, Phone
	, Address1
	, State
	, TopLevelDomain
	, Domain
	/* ========== BillTo & EndUser ========== */
	, [BillTo Email]
	, [EndUser Email]
	/* ========== TaskCommunications ========== */
	, Order_ID
	, ActionRequired
	, AI_CreateDate
	, AI_Createtime
	, [Action Item Age]   
    , IF([Action Item Age]<=15, '1-15',
    	IF([Action Item Age]<=30, '16-30', 
        IF([Action Item Age]<=60, '31-60', 
        IF([Action Item Age]<=90, '61-90', 
        'Over 90'))))AS [Action Item Age Group]
;
/*================================ SELECT ================================*/
SELECT 
	/* ========== Users/Orgs ========== */
	Salesrep.UserName AS SalesRep
	, UsersAll.Username AS Owner
    , Organizations.Name
	/* ========== Orders (Occs) ========== */
	, Occs.TotalOrder
	, OCCS.Team
	, OCCS.Vendor
	, OCCS.Reseller
    , OCCS.Datebooked AS DateBooked
	, Occs.CreateDate
	, OCCS.Status
	, OCCS.Region1
	, OCCS.Region2
	, OCCS.Region3
	, OCCS.Region4
	, OCCS.Region5
	, OCCS.MainAgency
	, OCCS.ContractType
	, Occs.VendorRep1
	, OCCS.ResellerRep1
	/* ========== Quotes ========== */
	, Quotes.ForecastAmount
	, Quotes.ProbabilityNumber
	/* ========== Customers ========== */
	, Customers.FirstName
	, Customers.LastName
	, Customers.Agency
	, Customers.Email
	, Customers.Phone
	, Customers.Address1
	, Customers.State
	, Customers.TopLevelDomain
	, Customers.Domain
	/* ========== BillTo & EndUser ========== */
	, billto.Email AS [BillTo Email]
	, enduser.Email AS [EndUser Email]
	/* ========== TaskCommunications ========== */
	, TasksCommunications.TabPK AS Order_ID
	, TasksCommunications.ActionRequired
	, TASksCommunications.CreateDate AS AI_CreateDate
	, CAST(dbo.convertInttoTime(LEFT(TASksCommunications.CreateTime, 6)) AS Varchar(8)) AS AI_Createtime
	, CAST(DATEDIFF(HOUR, CAST(TASksCommunications.createdate AS DATETIME) + dbo.convertInttoTime(LEFT(TASksCommunications.CreateTime, 6)),GETDATE()) AS INT) AS [Action Item Age]    
FROM TasksCommunications 
  INNER JOIN usersall ON usersall.user_id = owner_id 
  INNER JOIN OCCS ON OCCS.Order_ID = TASksCommunications.TabPK AND TASksCommunications.tabname = 'OCCS'
  LEFT OUTER JOIN usersall AS Salesrep ON OCCS.user_ID =  Salesrep.user_id 
  LEFT OUTER JOIN Quotes ON OCCS.Quote_ID = Quotes.Quote_ID
  LEFT OUTER JOIN Customers ON Quotes.Cust_ID = Customers.Cust_ID
  LEFT OUTER JOIN dbo.Customers AS billto ON Quotes.Billto_ID = billto.Cust_ID
  LEFT OUTER JOIN dbo.Customers AS enduser ON Quotes.EndUser_ID = enduser.Cust_ID
  LEFT OUTER JOIN Organizations ON OCCS.Organization_ID = Organizations.Organization_ID
WHERE outstanding = 1 
  AND (ActionRequired LIKE 'On Hold%' OR ActionRequired = 'Incomplete' OR ActionRequired LIKE 'Order%' OR ActionRequired = 'Credit Check') 
  AND ActionRequired NOT LIKE 'Order Placed%' 
  AND ActionRequired NOT LIKE 'Order Processed' 
  AND Assigned_ID IS NOT NULL 
  AND ActionRequired <> 'ON HOLD - Carahsoft'
;
