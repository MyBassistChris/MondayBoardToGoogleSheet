# Monday Board To Google Sheet

The following Google App Script will import data from a Monday Board to a Google Sheet. The Monday Admin must provide the API key in order to access the Monday boards.

The import will delete all data in the existing Google Sheet and overwrite it with the current data in the Monday Board. In order to implement a version of this code where it updates existing rows instead of rewriting the entire board the Last Updated column would be required. By adding the Last Updated column to desired board the script would then only pull the board rows that have been recently updated. Then you can update existing rows by the row name and add new rows that do not exist in Google Sheets. 

