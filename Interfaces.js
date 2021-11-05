function JiraIssueRepository(config) {
  this.JIRA_HOSTNAME = config['JIRA HOSTNAME']
  this.JIRA_PRIORITIZED_STATE_NAME = config['PRIORITIZED STATE NAME']
  this.JIRA_STARTED_STATE_NAME = config['STARTED STATE NAME']
  this.JIRA_DELIVERED_STATE_NAME = config['DELIVERED STATE NAME']
  this.JIRA_REJECTED_STATE_NAME = config['REJECTED STATE NAME']
  this.JIRA_PROJECT_KEY = config['PROJECT NAME KEY']
  this.JSESSIONID = config['JSESSIONID']
}

JiraIssueRepository.prototype.login = function(username, password) {
  const jiraUrl = 'https://' + this.JIRA_HOSTNAME + '/rest/auth/1/session'
  
  let body = JSON.stringify({
    'username': username,
    'password': password
  })

  const options = {
    method: 'POST',
    contentType: 'application/json', 
    payload: body
  }

  let response = null
  try {
    response = UrlFetchApp.fetch(jiraUrl, options)
  } catch (e) {
    Logger.log(e)
    return false
  }

  let jsonData = JSON.parse(response.getContentText())
  this.JSESSIONID = jsonData.session.value

  return true
}

JiraIssueRepository.prototype.getIssueData = function(issueId) {
  const jiraUrl = 'https://' + this.JIRA_HOSTNAME + '/rest/api/2/issue/' + issueId
                + '?expand=changelog&fields=issuetype,summary,created,resolutiondate,customfield_10308,status'

  const options = {
    method: 'GET',
    headers: {'Cookie': 'JSESSIONID=' + this.JSESSIONID}
  }

  var response = null
  try {
    response = UrlFetchApp.fetch(jiraUrl, options)
  } catch (e) {
    Logger.log(e)
    return null
  }
 
  return this.convertResponseToStory(issueId, response)
}

JiraIssueRepository.prototype.getPrioritizedIssueList = function() {
  const jiraUrl = 'https://' + this.JIRA_HOSTNAME + '/rest/api/2/search'
                + '?jql=project = ' + this.JIRA_PROJECT_KEY + ' AND labels IN (ProdDev) AND status = ' + this.JIRA_PRIORITIZED_STATE_NAME + ' ORDER BY Rank'
                + '&fields=summary'

  const options = {
    method: 'GET',
    headers: {'Cookie': 'JSESSIONID=' + this.JSESSIONID}
  }

  var response = null
  try {
    response = UrlFetchApp.fetch(jiraUrl, options)
  } catch (e) {
    Logger.log(e)
    return null
  }

  var issueList = []
  var jsonData = JSON.parse(response.getContentText())
  jsonData.issues.forEach(issue => {
    issueList.push(issue.key)
  })

  return issueList
}

JiraIssueRepository.prototype.convertResponseToStory = function(issueId, response) {
  var story = new Story(issueId)

  const jsonData = JSON.parse(response.getContentText())

  story.summary = jsonData.fields.summary
  story.points =  jsonData.fields.customfield_10308
  story.setCreatedDate(jsonData.fields.created)
  story.type = jsonData.fields.issuetype.name

  if (jsonData.fields.status.name == this.JIRA_STARTED_STATE_NAME ||
      jsonData.fields.status.name == this.JIRA_DELIVERED_STATE_NAME ||
      jsonData.fields.status.name == this.JIRA_REJECTED_STATE_NAME ||
      jsonData.fields.status.name == "Done") {
    const startedDate = this.determineStartedDate(jsonData)
    if (startedDate != null) {
      story.setStartedDate(startedDate)
    }
  }

  if (jsonData.fields.resolutiondate) {
    story.setResolvedDate(jsonData.fields.resolutiondate)
  }

  return story
}

JiraIssueRepository.prototype.determineStartedDate = function(jsonData) {
  var startedDate = null
  jsonData.changelog.histories.forEach(changeRecord => {
    if (changeRecord.items[0].field == 'status' && 
        changeRecord.items[0].fromString == this.JIRA_PRIORITIZED_STATE_NAME &&
        changeRecord.items[0].toString == this.JIRA_STARTED_STATE_NAME) {
      startedDate = changeRecord.created
    }
  })

  return startedDate
}

