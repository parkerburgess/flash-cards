# Summary
This will be a flash card program.  
The data will be saved locally for now but there should be an interface for future migration.
There needs to be a CRUD interface for the cards and categories

# Concepts
The cards:
    they will have categories, i.e. bible scripts, fish Identification, fly pattern Identification
    There will be image and text cards
      Image cards will have an image as the clue and text as the answer
      Text cards will have text clues and answers.  There should be an option to flip and randomize the clue/answer.

Data access layer:
  there must be a layer to abstract the data methods
  this is to support future migration to a db

## modes:

CRUD:
  Create:
    first a category must be selected
      categories will come from a JSON file that is behind the data access layer
    Clues will be either text or an image upload but not both
    Answer will be proviced
    Auto increment a CardId
    a card will not be create unless there is a category, clue, and answer
  Update:
    do not allow category changes
  Delete:
    have a confirmation

Study:
    it will have 2 modes, data review and mock test
      data review
        select how many to show
        display the clue on the left and answer on the right
        have a next button if needed
        each row should have a small button that accesses the CRUD for that card
          it shoud be a pop-up
      mock test
        a card will have 2 sides
          clue side
            displays the clue
            no data entry
            flip button that moves to the answer
          answer side
            displays the answer
            buttons for 'Correct', 'Incorrect', 'Skip'
        The page should display card X of Y
        The page should display counts for 'Correct', 'Incorrect', 'Skip'
        once the mock is over display the results
        Do not save the results
        
Tests:
    Select the category
    Select the mode
      Count
        select the number of cards to test
        there should be an 'All' option
          this option should show how many cards there are
        The user must answer all cards
        the metric:
          named: CountModeScore
          the percentage of correct answers
      Survival
        the user selects an IncorrectsAllowed value
        the user tests against all cards until that IncorrectAllowed value is reached
        The metric 
          named: SurvivalScore
          the number of correct answers
    Testing:
      One card will be displayed at a time
      Clue side:
        show the clue on top
        show a submittion area under the clue
          submitions should be text only
          there should be 'Clear', 'Submit', and 'Skip' buttons
      Answer side:
        show the clue
        show the submittion next
        show the Answer on the bottom
        change the border color based on 'Correct', 'Incorrect', 'Skipped'
          Note: for results 'Skipped' will count as an incorrect
        There should be a 'Next' button
          moves to the next card
          if there are no more cards show results page

      Test results will be saved for reporting
Reporting:
    grouped by category, Survival
    top 3-10 of missed cards
      allow a click through to the study cards


