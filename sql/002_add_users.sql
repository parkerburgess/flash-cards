-- Adds user ownership to the flashcards schema. Run once against the
-- already-deployed shared ParkerFreeDB server (sql/schema.sql only covers
-- a fresh install and won't touch existing tables).
--
-- DESTRUCTIVE: this deletes every existing row in flashcards.TestResultCard,
-- TestResult, Card, and Category before adding the NOT NULL UserId columns,
-- since none of the current rows have an owner to backfill to. Back up
-- first if any of this data is worth keeping.

DELETE FROM flashcards.TestResultCard;
DELETE FROM flashcards.TestResult;
DELETE FROM flashcards.Card;
DELETE FROM flashcards.Category;
GO

ALTER TABLE flashcards.Category ADD UserId NVARCHAR(50) NOT NULL;
GO
CREATE INDEX IX_Category_UserId ON flashcards.Category (UserId);
GO

ALTER TABLE flashcards.Card ADD UserId NVARCHAR(50) NOT NULL;
GO
CREATE INDEX IX_Card_UserId ON flashcards.Card (UserId);
GO

ALTER TABLE flashcards.TestResult ADD UserId NVARCHAR(50) NOT NULL;
GO
CREATE INDEX IX_TestResult_UserId ON flashcards.TestResult (UserId);
GO
