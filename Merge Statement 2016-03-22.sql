  MERGE [QuotesWeekly] as DEST USING (
                            SELECT
convert(date,GetDate()) AS [Date],
Quotes.User_ID AS [User_ID],
quotes.Team AS [Team],
quotes.Vendor_ID AS [Vendor_ID],
quotes.Organization_ID AS [Organization_ID],
SUM(CASE WHEN ProbabilityNumber = 0 THEN 1 ELSE 0 END) AS [0Percent], 
SUM(CASE WHEN ProbabilityNumber = 10 THEN 1 ELSE 0 END) AS [10Percent], 
SUM(CASE WHEN ProbabilityNumber = 25 THEN 1 ELSE 0 END) AS [25Percent], 
SUM(CASE WHEN ProbabilityNumber = 33 THEN 1 ELSE 0 END) AS [33Percent], 
SUM(CASE WHEN ProbabilityNumber = 50 THEN 1 ELSE 0 END) AS [50Percent], 
SUM(CASE WHEN ProbabilityNumber = 75 THEN 1 ELSE 0 END) AS [75Percent], 
SUM(CASE WHEN ProbabilityNumber = 90 THEN 1 ELSE 0 END) AS [90Percent], 
SUM(CASE WHEN ProbabilityNumber = 99 THEN 1 ELSE 0 END) AS [99Percent], 
SUM(CASE WHEN ProbabilityNumber = 0 THEN QuoteTotal ELSE 0 END) AS [0PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 10 THEN QuoteTotal ELSE 0 END) AS [10PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 25 THEN QuoteTotal ELSE 0 END) AS [25PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 33 THEN QuoteTotal ELSE 0 END) AS [33PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 50 THEN QuoteTotal ELSE 0 END) AS [50PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 75 THEN QuoteTotal ELSE 0 END) AS [75PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 90 THEN QuoteTotal ELSE 0 END) AS [90PercentTotal], 
SUM(CASE WHEN ProbabilityNumber = 99 THEN QuoteTotal ELSE 0 END) AS [99PercentTotal]
FROM
	Quotes
Join 
	users
ON
	Quotes.User_ID = users.user_id
WHERE
	QuoteDate > GETDATE()-7
AND 
	QuoteDate < GETDATE()
GROUP BY 
	  Quotes.User_ID, users.username,  quotes.team, quotes.vendor, quotes.Organization_ID

                       ) AS SRC
                        ON DEST.Date = SRC.Date and Dest.[User_ID] = SRC.[User_ID]
                        WHEN NOT MATCHED THEN  
                            INSERT (
      [Date]
      ,[User_ID]
      ,[Team]
      ,[Vendor_ID]
	  ,[Organization_ID]
      ,[0Percent]
      ,[10Percent]
      ,[25Percent]
      ,[33Percent]
      ,[50Percent]
      ,[75Percent]
      ,[90Percent]
      ,[99Percent]
      ,[0PercentTotal]
      ,[10PercentTotal]
      ,[25PercentTotal]
      ,[33PercentTotal]
      ,[50PercentTotal]
      ,[75PercentTotal]
      ,[90PercentTotal]
      ,[99PercentTotal]) 
                            VALUES (
							      src.[Date]
      ,src.[User_ID]
      ,src.[Team]
      ,src.[Vendor_ID]
	  ,src.[Organization_ID]
      ,src.[0Percent]
      ,src.[10Percent]
      ,src.[25Percent]
      ,src.[33Percent]
      ,src.[50Percent]
      ,src.[75Percent]
      ,src.[90Percent]
      ,src.[99Percent]
      ,src.[0PercentTotal]
      ,src.[10PercentTotal]
      ,src.[25PercentTotal]
      ,src.[33PercentTotal]
      ,src.[50PercentTotal]
      ,src.[75PercentTotal]
      ,src.[90PercentTotal]
      ,src.[99PercentTotal]
							);
