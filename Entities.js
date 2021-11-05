function Story(issueId, rowNumber) {
    this.issueId = issueId
    this.rowNumber = rowNumber
    this.summary = ''
    this.points = null
    this.createdDate = null
    this.startedDate = null
    this.resolvedDate = null
    this.estimatedResolvedDate = null
    this.type = null
}

Story.prototype.setCreatedDate = function(createdDateAsString) {
  this.createdDate = new Date(createdDateAsString)
}

Story.prototype.setStartedDate = function(startedDateAsString) {
  this.startedDate = new Date(startedDateAsString)
}

Story.prototype.setResolvedDate = function(resolvedDateAsString) {
  this.resolvedDate = new Date(resolvedDateAsString)
}

function Credentials() {
  this.username = null
  this.password = null
}