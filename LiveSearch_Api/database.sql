

---------------LIVESEARCH-------------

use shuetam_livesearch

------------------------LIVESEARCH-------------------------

-----------------------NEW DATABASE-----------------------


CREATE TABLE Users
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserSocialId NVARCHAR (100),
    UserName NVARCHAR (100) NOT NULL,
    UserEmail NVARCHAR (50) NOT NULL,
    CreatedAt DATETIME NULL,
    LastLogin DATETIME NULL,
    LoginsCount INT,
    IsActive BIT,
    AuthType NVARCHAR (10) NOT NULL
)

ALTER TABLE SharedFolders
ADD  ID UNIQUEIDENTIFIER PRIMARY KEY;

ALTER TABLE Users
ADD UserRole NVARCHAR (10) NULL;

ALTER TABLE Users
ADD Salt NVARCHAR (MAX) NULL;

ALTER TABLE Users
ADD PasswordHash NVARCHAR (MAX) NULL;

ALTER TABLE Users
ADD ResetId UNIQUEIDENTIFIER NULL;

ALTER TABLE Users
ADD NewSalt NVARCHAR (MAX) NULL;

ALTER TABLE Folders
DROP COLUMN Followers;

ALTER TABLE Folders
DROP COLUMN IconsCount;


DELETE FROM SharedFolders WHERE ID IS NOT NULL
select * from SharedFolders
select * from Folders


  

 
    public DateTime? SharedAt { get; protected set; }


select * from Users


ALTER TABLE Folders
ADD SharedAt DATETIME NULL;

ALTER TABLE Folders
ADD UpdatedAt DATETIME NULL;

ALTER TABLE Users
ADD IsPublic NVARCHAR (100) NULL;

ALTER TABLE Users
ADD SharedAt DATETIME NULL;

ALTER TABLE Users
ADD UpdatedAt DATETIME NULL;


SELECT * FROM USERS


ALTER TABLE Users
ADD NewPasswordHash NVARCHAR (MAX) NULL;

ALTER TABLE Users
ADD  ResetPassword DATETIME NULL;

 public string NewPasswordHash {get; protected set;}
     public string NewSalt {get; protected set;}
     public DateTime? ResetPassword {get; protected set;}


SELECT
	IsPublic
FROM
  select * from	INFORMATION_SCHEMA.COLUMNS
WHERE
	TABLE_NAME = 'Users'

SELECT * FROM Users

select * from TVMovies

DROP TABLE Users

SELECT * FROM UserYoutubes

SELECT * FROM UserImages

delete from UserYoutubes
WHERE LocLeft like '%20%'

UPDATE Users
SET UserRole = 'USER'
WHERE AuthType like 'Google' 

UPDATE Users
SET UserRole = 'ADMIN'
WHERE AuthType like 'Facebook' 

UPDATE Users
SET IsActive = 1
WHERE TRUE


UPDATE Folders
SET IsShared = 0


select * from Folders

delete from Users 
WHERE AuthType like 'LiveSearch'

delete from UserYoutubes
WHERE FolderId is NULL

ALTER TABLE UserImages
ADD ImgType NVARCHAR (20) NULL;

alter table UserYoutubes
add AddedToFolder DATETIME NULL

select * from UserYoutubes

alter table UserSpotify
add Tags  NVARCHAR (400)  NULL

ALTER TABLE Songs
DROP COLUMN Added;

ALTER TABLE TVMovies
DROP COLUMN Added;

ALTER TABLE Bestsellers
DROP COLUMN Added;

alter table Songs
add Added DATETIME NULL 

alter table TVMovies
add Added DATETIME NULL 

alter table TVMovies
add UrlEmisionDay NVARCHAR (50) NULL

alter table Bestsellers
add Added DATETIME NULL 


alter table ArchiveMovies
add Rating NVARCHAR (20) NULL
--------------------------------
alter table ArchiveMovies
add Title NVARCHAR (300) NULL

alter table ArchiveMovies
add Station NVARCHAR (50) NULL

alter table ArchiveSongs
add Station NVARCHAR (50) NULL

alter table UserYoutubes
add ImgSource NVARCHAR (MAX)  NULL

alter table UserYoutubes
add MovieType NVARCHAR (20)  NULL

---------------------------------
select * from ArchiveMovies
select * from ArchiveSongs

select * from Folders

select * from Bestsellers

select * from UserYoutubes

alter table UserImages
add UrlAddress NVARCHAR (MAX)  NULL

CREATE TABLE UserYoutubes
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    FolderId UNIQUEIDENTIFIER NULL,
    VideoId NVARCHAR (300) NOT NULL,
    LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    Title NVARCHAR (300) NOT NULL,
    CreatedAt DATETIME,
)


CREATE TABLE UserImages
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    FolderId UNIQUEIDENTIFIER NULL,
    Source NVARCHAR (MAX) NOT NULL,
    LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    Title NVARCHAR (300) NOT NULL,
    CreatedAt DATETIME,
    AddedToFolder DATETIME NULL,
    UrlAddress NVARCHAR (MAX) NOT  NULL
)

select * from SharedFolders

DROP TABLE UserImages

ALTER TABLE UserImages ADD CONSTRAINT 
FK_ImageUserID FOREIGN KEY (UserId) 
REFERENCES Users(ID)

ALTER TABLE UserImages ADD CONSTRAINT 
FK_ImageFolderID FOREIGN KEY (FolderId) 
REFERENCES Folders(ID)
-------------------------------------------------------------
    public Guid UserId {get; protected set;}
    public Guid? FolderId {get; protected set;}
    public string SpotifyId {get; protected set;}
    public string ImgSource {get; protected set;}
    public string LocLeft {get; protected set;}
    public string LocTop {get; protected set;}
    public string Title {get; protected set;}
    public DateTime CreatedAt {get; protected set;}
    public DateTime? AddedToFolder {get; protected set;}
-------------------------------------------------------------


CREATE TABLE UserSpotify
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    FolderId UNIQUEIDENTIFIER NULL,
    SpotifyId NVARCHAR (300)  NULL,
    ImgSource NVARCHAR (MAX)  NULL,
    LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    Title NVARCHAR (300) NOT NULL,
    CreatedAt DATETIME,
    AddedToFolder DATETIME NULL,
)

select * from UserSpotify

ALTER TABLE UserSpotify ADD CONSTRAINT 
FK_SpotifyUserID FOREIGN KEY (UserId) 
REFERENCES Users(ID)

ALTER TABLE UserSpotify ADD CONSTRAINT 
FK_SpotifyFolderID FOREIGN KEY (FolderId) 
REFERENCES Folders(ID)



drop table UserYoutubes

UPDATE Folders
SET LocLeft = '50vw'
WHERE ParentId is NULL; 


UPDATE Folders
SET IsShared = 0
WHERE IsShared is NULL;

UPDATE UserYoutubes
SET LocLeft = '50vw', LocTop = '10vh'
WHERE LocLeft like '%110%';


ALTER TABLE UserYoutubes ADD CONSTRAINT 
FK_YoutubeUserID FOREIGN KEY (UserId) 
REFERENCES Users(ID)


DELETE FROM UserSpotify WHERE
SpotifyId like '%http%'

SELECT * FROM UserSpotify

select * from UserImages

DELETE FROM Folders WHERE
Title like '%www%'

CREATE TABLE SharedFolders
(
	ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    FolderId UNIQUEIDENTIFIER NOT NULL,
	LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    FallowedAt DATETIME NOT NULL,
)


CREATE TABLE SharedDesktops
(
	ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    OwnerId UNIQUEIDENTIFIER NOT NULL,
	LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    FallowedAt DATETIME NOT NULL,
)



DROP TABLE SharedFolders

select * from SharedFolders

ALTER TABLE SharedFolders ADD CONSTRAINT 
FK_UserID FOREIGN KEY (UserId) 
REFERENCES Users(ID)

ALTER TABLE SharedFolders ADD CONSTRAINT 
FK_FolderID FOREIGN KEY (FolderId) 
REFERENCES Folders(ID)

CREATE TABLE Folders
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ParentId UNIQUEIDENTIFIER NULL,
    LocLeft NVARCHAR (50) NOT NULL,
    LocTop NVARCHAR (50) NOT NULL,
    Title NVARCHAR (300) NOT NULL,
    CreatedAt DATETIME,
)

ALTER TABLE UserYoutubes ADD CONSTRAINT 
FK_YoutubeFolderID FOREIGN KEY (FolderId) 
REFERENCES Folders(ID)


ALTER TABLE Folders ADD CONSTRAINT 
FK_FoldersUserID FOREIGN KEY (UserId) 
REFERENCES Users(ID)



CREATE TABLE Bestsellers
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR (200) NOT NULL,
    Author NVARCHAR (200) NOT NULL,
    ImageSrc NVARCHAR (300) NOT NULL,
    Store NVARCHAR (50) NOT NULL,
    Size  INT  NULL,
    GroupNo  INT  NULL,
)

select * from Bestsellers where Title like '%�%'



select * from YouTubes where Name like '%Race%'


CREATE TABLE YouTubes
(
    ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    top_ NVARCHAR (50) NOT NULL,
    left_ NVARCHAR (50) NOT NULL,
    VideoID NVARCHAR (300) NOT NULL,
)


CREATE TABLE Songs
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR (300) NOT NULL,
    Station NVARCHAR (20) NULL,
    PlayAt DATETIME NULL,
    YouTubeID  INT  NULL,
)

CREATE TABLE TVMovies
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR (300) NOT NULL,
    TrailerSearch NVARCHAR (300) NOT NULL,
    Station NVARCHAR (30) NULL,
    Rating NVARCHAR (20) NULL,
    PlayAt DATETIME NULL,
    YouTubeID  INT  NULL,
)

ALTER TABLE TVMovies ADD CONSTRAINT 
FK_Movie_YouTube FOREIGN KEY (YouTubeID) 
REFERENCES YouTubes(ID)


DELETE FROM TVMovies WHERE
Station like 'TVP ABC'

SELECT * FROM TVMovies where Title like '%Logan%'

SELECT * FROM YouTubes
SELECT * FROM ArchiveSongs where Name like '%Quebo%'

CREATE TABLE ArchiveSongs
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR (300) NOT NULL,
    YouTubeID  INT  NULL,
)

CREATE TABLE ArchiveMovies
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR (300) NOT NULL,
    YouTubeID  INT  NULL,
)
select * from  ArchiveMovies

select * from TVMovies

ALTER TABLE ArchiveMovies ADD CONSTRAINT 
FK_YouTubeMovieArchive FOREIGN KEY (YouTubeID) 
REFERENCES YouTubes(ID)


ALTER TABLE Songs ADD CONSTRAINT 
FK_YouTube FOREIGN KEY (YouTubeID) 
REFERENCES YouTubes(ID)

ALTER TABLE ArchiveSongs ADD CONSTRAINT 
FK_YouTubeArchive FOREIGN KEY (YouTubeID) 
REFERENCES YouTubes(ID)

select * from Songs

select * from  ArchiveSongs  left join YouTubes on ArchiveSongs.YouTubeID=Youtubes.ID
where VideoID like '%Error%'

select * from  TVMovies  left join YouTubes on TVMovies.YouTubeID=Youtubes.ID
where VideoID like '%Error%'

select *  from  Songs  left join YouTubes on Songs.YouTubeID=Youtubes.ID

drop TABLE ActualSongs



-------------------------------------------------------------



SELECT * FROM RadioSongs

SELECT Sum(Count), YouTubeId, Name
from RadioSongs
GROUP By  Name

CREATE TABLE RadioSongs
(
    ID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR (300) NOT NULL,
    YouTubeId NVARCHAR (100) NOT NULL,
    Count INT  NULL,
    Size NVARCHAR (200) NOT NULL,
    top_ NVARCHAR (200) NOT NULL,
    left_ NVARCHAR (200) NOT NULL,
    CountRmf INT  NULL,
    CountZet INT  NULL,
    CountEska INT  NULL,
    CountRmfMaxx INT  NULL,
    CountAntyRadio INT  NULL,
    CountRmfClassic INT  NULL,
    CountChilliZet INT  NULL,
    CountZlotePrzeboje INT  NULL,
    CountVox INT  NULL,
    CountPlus INT  NULL,
)



   
      
