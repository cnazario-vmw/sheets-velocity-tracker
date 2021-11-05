function updateStoryData(issueRepository) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getSheetByName("Story Data")

  var stories = getStoriesWithMissingData(sheet)
  stories.forEach((story) => {
    var issueData = issueRepository.getIssueData(story.issueId)
    
    if(issueData) {
      // issueData does not know the row number of the cell so this 
      // felt more right instead of making issue data aware of a row number
      story.summary = issueData.summary
      story.points = issueData.points
      story.createdDate = issueData.createdDate
      story.startedDate = issueData.startedDate
      story.resolvedDate = issueData.resolvedDate
      story.type = issueData.type

      updateStoriesInSheet(sheet, story)
    }
  })
}






