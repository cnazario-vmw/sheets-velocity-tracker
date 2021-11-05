const onOpen = (e) => {
  SpreadsheetApp.getUi()
    .createMenu("Kohls")
    .addItem("Update stories","updateStories")
    .addItem("Estimate completion date", "estimateStories")
    .addToUi()
}

function updateStories() {
  const config = getSettings()

  let html = HtmlService.createHtmlOutputFromFile('Index')
  //SpreadsheetApp.getUi().showModalDialog(html, "Please provide your Jira login details")

  let credentials = getUserCredentials()

  var issueRepository = new JiraIssueRepository(config)
  issueRepository.login(credentials.username,credentials.password)

  updateStoryData(issueRepository)
}

function estimateStories() {
  const config = getSettings()

  var issueRepository = new JiraIssueRepository(config)
  estimateStoryCompletion(issueRepository)
}

function getSettings() {
  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings')
  var range = settingsSheet.getRange('A2:C8')
  
  var settings = {}
  range.getValues().forEach(row => {
    settings[row[0]] = row[2].trim()
  })

  return settings
}

function getUserCredentials() {
  let credentials = new Credentials()
  credentials.username = 'xxxx'
  credentials.password = 'xxxx'

  return credentials
}

