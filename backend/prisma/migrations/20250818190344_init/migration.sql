-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "spotifyId" TEXT,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "trackNumber" INTEGER,
    "spotifyId" TEXT,
    "albumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumRating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "albumId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlbumRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "albumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingItem" (
    "id" SERIAL NOT NULL,
    "rankingSessionId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "RankingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotifyId_key" ON "Album"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_spotifyId_key" ON "Song"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumRating_userId_albumId_key" ON "AlbumRating"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingSession_userId_albumId_createdAt_key" ON "RankingSession"("userId", "albumId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RankingItem_rankingSessionId_songId_key" ON "RankingItem"("rankingSessionId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingItem_rankingSessionId_position_key" ON "RankingItem"("rankingSessionId", "position");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumRating" ADD CONSTRAINT "AlbumRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumRating" ADD CONSTRAINT "AlbumRating_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingSession" ADD CONSTRAINT "RankingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingSession" ADD CONSTRAINT "RankingSession_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingItem" ADD CONSTRAINT "RankingItem_rankingSessionId_fkey" FOREIGN KEY ("rankingSessionId") REFERENCES "RankingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingItem" ADD CONSTRAINT "RankingItem_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
