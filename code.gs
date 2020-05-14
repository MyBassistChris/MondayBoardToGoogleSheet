// API key stored in File | Project Properties | Script Properties
var mondayAPIkey = PropertiesService.getScriptProperties().getProperty('mondayAPIkey');

// ID of destination board (monday.com/board/ID)
var myBoardID = 123456789;
var myBoardID2 = 234567890;

//Create Custom Menu to enable import
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CustomMenu')
   .addItem('Update', 'updateAll')
   .addToUi();
}

function updateAll() {
  copyBoard(myBoardID, "mySheet");
  copyBoard(myBoardID2, "mySheet2");
}

//Credit for API call: https://github.com/yuhgto/mondaydotcom-google-sheets-simple/blob/master/google_sheets_monday_integration.gs
function makeAPICall(key, query, variables) {
  var url = "https://api.monday.com/v2";
  var options = {
    "method" : "post",
    "headers" : {
      "Authorization" : key,
    },
    "payload" : JSON.stringify({
      "query" : query,
      "variables" : variables
    }),
    "contentType" : "application/json"
  };
  var response = UrlFetchApp.fetch(url, options);
  return response;
}

//Copies board items from monday and copies it to sheetName. Header of sheet (first row) stays intact. 
function copyBoard(boardID, sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var numColumns= sheet.getLastColumn();
  var headerRange = sheet.getRange(1, 1, 1, numColumns).getValues();
  
  var query = "query{boards (ids: " + boardID + ") {items { name column_values { title value } } } }";
  var data = JSON.parse(makeAPICall(mondayAPIkey, query, {}));
  var mondayData = data.data.boards[0].items;
  sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).clearContent();
  var newData = [];
  for (var i = 0; i < mondayData.length; i++) {
    newData.push(newRow(sheetName, mondayData[i], i));
  }
  sheet.getRange(2, 1, newData.length, newData[0].length).setValues(newData);
}

//Handles import of row based on which Monday board is being imported.
//Different Monday column types are returned different in JSON (EX: text VS date)
//Sliced text values because they are returned in quotes
function newRow(sheetName, data, rowIndex) {
  var columns = data.column_values;
  switch (sheetName) {
    case "mySheet":
      return [(JSON.parse(columns[1].value).date), //Date 1
              data.name,                           //Name
              columns[2].value.slice(1,-1),        //Text Field 1
              (JSON.parse(columns[3].value).date), //Date 2
              JSON.parse(columns[5].value).text];  //Text Field 2
    case "mySheet2":
      return [data.name,                           //Name    
              (JSON.parse(columns[1].value).date), //Date 1
              columns[2].value.slice(1,-1),        //Text Field 1
              columns[10].value.slice(1,-1)];      //Text Field 2
  }
}