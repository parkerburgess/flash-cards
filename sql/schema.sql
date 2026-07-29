-- Flash Cards schema — run once against the shared ParkerFreeDB server.
-- Mirrors the goodbad/skill convention: one SQL schema per app to avoid
-- table-name collisions in the shared database.

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'flashcards')
    EXEC('CREATE SCHEMA flashcards');
GO

CREATE TABLE flashcards.Category (
    CategoryId INT IDENTITY(1,1) NOT NULL,
    Name       NVARCHAR(200)     NOT NULL,
    CONSTRAINT PK_Category PRIMARY KEY (CategoryId)
);
GO

CREATE TABLE flashcards.Card (
    CardId     INT IDENTITY(1,1) NOT NULL,
    CategoryId INT               NOT NULL,
    ClueType   VARCHAR(10)       NOT NULL,
    Clue       NVARCHAR(MAX)     NOT NULL,
    Answer     NVARCHAR(500)     NOT NULL,
    CreatedAt  DATETIME2         NOT NULL CONSTRAINT DF_Card_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt  DATETIME2         NOT NULL CONSTRAINT DF_Card_UpdatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Card PRIMARY KEY (CardId),
    -- NO ACTION: Card and TestResult both trace back to Category, and SQL
    -- Server rejects multiple cascade paths converging on TestResultCard.
    -- The app deletes Cards explicitly (in dependency order) when a
    -- Category is deleted — see SqlDataAccess.deleteCategory.
    CONSTRAINT FK_Category_Card FOREIGN KEY (CategoryId)
        REFERENCES flashcards.Category (CategoryId),
    CONSTRAINT CK_Card_ClueType CHECK (ClueType IN ('text', 'image'))
);
GO

CREATE TABLE flashcards.TestResult (
    TestResultId INT IDENTITY(1,1) NOT NULL,
    CategoryId   INT               NOT NULL,
    Mode         VARCHAR(10)       NOT NULL,
    Score        FLOAT             NOT NULL,
    CreatedAt    DATETIME2         NOT NULL CONSTRAINT DF_TestResult_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_TestResult PRIMARY KEY (TestResultId),
    CONSTRAINT FK_Category_TestResult FOREIGN KEY (CategoryId)
        REFERENCES flashcards.Category (CategoryId),
    CONSTRAINT CK_TestResult_Mode CHECK (Mode IN ('count', 'survival'))
);
GO

-- One row per card answered within a test — normalizes the CardResult[]
-- array that used to be embedded JSON in test-results.json.
CREATE TABLE flashcards.TestResultCard (
    TestResultCardId INT IDENTITY(1,1) NOT NULL,
    TestResultId     INT               NOT NULL,
    CardId           INT               NOT NULL,
    Submission       NVARCHAR(MAX)     NOT NULL,
    Status           VARCHAR(10)       NOT NULL,
    CONSTRAINT PK_TestResultCard PRIMARY KEY (TestResultCardId),
    CONSTRAINT FK_TestResult_TestResultCard FOREIGN KEY (TestResultId)
        REFERENCES flashcards.TestResult (TestResultId),
    -- Deleting a single Card (outside of a Category delete) leaves its
    -- historical TestResultCard rows in place; MissedCardsList already
    -- tolerates a missing card (filters it out), so this mirrors existing
    -- app behavior rather than introducing new orphan handling.
    CONSTRAINT FK_Card_TestResultCard FOREIGN KEY (CardId)
        REFERENCES flashcards.Card (CardId),
    CONSTRAINT CK_TestResultCard_Status CHECK (Status IN ('correct', 'incorrect', 'skipped'))
);
GO
