// Problems with this
// 1. getStoriesWithMissingDasta and getIncompleteStories are nearly the same
// 2. updateStoriesInSheet depends on summary, points, and create data always being part of the story object
//    which makes it a bit inflexible
// 3. Should this perhaps be some sort of interface that gets injected into the usecase?

const STORY_ID_CELL = 0
const STORY_SUMMARY_CELL = 1
const STORY_POINTS_CELL = 2
const STORY_CREATE_DATE_CELL = 3
const STORY_ESTIMATED_RESOLUTION_DATE_CELL = 4
const STORY_STARTED_DATE_CELL = 5
const STORY_RESOLUTION_DATE_CELL = 6
const STORY_TYPE_CELL = 10

function getStoriesWithMissingData(sheet) {
  var stories = []
  var range = sheet.getRange('A2:K')

  range.getValues().forEach((row, index) => {
    if(!isEmptyCell(row[STORY_ID_CELL]) && 
        (
          isEmptyCell(row[STORY_SUMMARY_CELL]) ||
          isEmptyCell(row[STORY_POINTS_CELL]) || 
          isEmptyCell(row[STORY_CREATE_DATE_CELL]) ||
          isEmptyCell(row[STORY_STARTED_DATE_CELL]) ||
          isEmptyCell(row[STORY_RESOLUTION_DATE_CELL]) ||
          isEmptyCell(row[STORY_TYPE_CELL])
        )
      ) {
      var story = new Story(row[STORY_ID_CELL], index + 2)
      
      if (!isEmptyCell(row[STORY_SUMMARY_CELL])) {
        story.summary = row[STORY_SUMMARY_CELL]
      }

      if (!isEmptyCell(row[STORY_POINTS_CELL])) {
        story.points = row[STORY_POINTS_CELL]
      }

      if (!isEmptyCell(row[STORY_CREATE_DATE_CELL])) {
        story.setCreatedDate(row[STORY_CREATE_DATE_CELL])
      }

      if (!isEmptyCell(row[STORY_STARTED_DATE_CELL])) {
        story.setStartedDate(row[STORY_STARTED_DATE_CELL])
      }

      if (!isEmptyCell(row[STORY_RESOLUTION_DATE_CELL])) {
        story.setResolvedDate(row[STORY_RESOLUTION_DATE_CELL])
      }

      if (!isEmptyCell(row[STORY_TYPE_CELL])) {
        story.setResolvedDate(row[STORY_TYPE_CELL])
      }

      stories.push(story)   
    }
  })

  return stories
}

function getIncompleteStories(sheet) {
  var stories = []
  
  var range = sheet.getRange("A2:J")

  range.getValues().forEach((row, index) => {
    if( hasIssueId(row) && !isCompleted(row) ) {
      var story = new Story(row[STORY_ID_CELL],index + 2)

      if (!isEmptyCell(row[STORY_SUMMARY_CELL])) {
        story.summary = row[STORY_SUMMARY_CELL]
      }

      if (!isEmptyCell(row[STORY_POINTS_CELL])) {
        story.points = row[STORY_POINTS_CELL]
      }

      if (!isEmptyCell(row[STORY_CREATE_DATE_CELL])) {
        story.setCreatedDate(row[STORY_CREATE_DATE_CELL])
      }

      if (!isEmptyCell(row[STORY_STARTED_DATE_CELL])) {
        story.setStartedDate(row[STORY_STARTED_DATE_CELL])
      }

      if (!isEmptyCell(row[STORY_RESOLUTION_DATE_CELL])) {
        story.setResolvedDate(row[STORY_RESOLUTION_DATE_CELL])
      }

      stories.push(story)
    }
  })

  return stories
}

const isEmptyCell = (value) => value === ''
const hasIssueId = (row) => row[STORY_ID_CELL] != ''
const isCompleted = (row) => row[STORY_RESOLUTION_DATE_CELL] != ''

function updateStoriesInSheet(sheet, story) {
  sheet.getRange(story.rowNumber, STORY_SUMMARY_CELL + 1).setValue(story.summary)
  sheet.getRange(story.rowNumber, STORY_POINTS_CELL + 1).setValue(story.points)
  sheet.getRange(story.rowNumber, STORY_CREATE_DATE_CELL + 1).setValue(story.createdDate)

  if (story.estimatedResolvedDate) {
    sheet.getRange(story.rowNumber, STORY_ESTIMATED_RESOLUTION_DATE_CELL + 1).setValue(story.estimatedResolvedDate)
  }

  if (story.startedDate) {
    sheet.getRange(story.rowNumber, STORY_STARTED_DATE_CELL + 1).setValue(story.startedDate)
  }

  if (story.resolvedDate) {
    sheet.getRange(story.rowNumber, STORY_RESOLUTION_DATE_CELL + 1).setValue(story.resolvedDate)
  }

  if (story.type) {
    sheet.getRange(story.rowNumber, STORY_TYPE_CELL + 1).setValue(story.type)
  }
}