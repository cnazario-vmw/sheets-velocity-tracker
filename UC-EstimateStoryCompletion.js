function estimateStoryCompletion(issueRepository) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  var sheet = spreadsheet.getSheetByName("Metrics")
  var weekEnding = getCurrentWeekEndingDate(sheet)
  var velocity = getCurrentVelocity(sheet)
  var completedPoints = getPointsCompletedThisWeek(sheet)

  sheet = spreadsheet.getSheetByName("Story Data")
  var stories = getIncompleteStories(sheet)

  var prioritizedStories = issueRepository.getPrioritizedIssueList()
  prioritizedStories = addInProgressStories(prioritizedStories, stories)

  stories.sort((storyA,storyB) => {
    return prioritizedStories.indexOf(storyA.issueId) - prioritizedStories.indexOf(storyB.issueId)
  })

  var totalPoints = completedPoints
  stories.forEach(story => {
    if (story.points != null) {
      totalPoints += story.points
    }

    var weekOffset = Math.floor(totalPoints / velocity)
    var targetCompletion = calculateTargetCompletionDate(weekEnding, weekOffset)

    story.estimatedResolvedDate = targetCompletion

    updateStoriesInSheet(sheet, story)
  })
}

function getCurrentWeekEndingDate(sheet) {
  var range = sheet.getRange("J3:J3")
  var weekStartingAsString = range.getValues()[0][0]
  var weekEnding = new Date(weekStartingAsString)
  weekEnding.setDate(weekEnding.getDate() + 5)
  return weekEnding
}

function getCurrentVelocity(sheet) {
  var range = sheet.getRange("J5:J5")
  return Number(range.getValues()[0][0])
}

function getPointsCompletedThisWeek(sheet) {
  var range = sheet.getRange("J4:J4")
  return Number(range.getValues()[0][0])
}

function addInProgressStories(prioritizedStories, stories) {
  var storyIds = []

  stories.forEach(story => {
    if (story.startedDate != null) {
      storyIds.push(story.issueId)
    }
  })

  return storyIds.concat(prioritizedStories)
}

function calculateTargetCompletionDate(weekEnding, weekOffset) {
  var date = new Date(weekEnding)
  date.setDate(date.getDate() + weekOffset * 7)
  return date
}