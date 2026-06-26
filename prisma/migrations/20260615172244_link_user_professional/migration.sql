-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CityWaitlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Professional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Photographer',
    "city" TEXT NOT NULL DEFAULT '',
    "rating" REAL NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'Wedding',
    "price" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "image" TEXT NOT NULL DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',
    "aiScore" INTEGER NOT NULL DEFAULT 80,
    "bio" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,
    CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Professional" ("aiScore", "category", "city", "createdAt", "id", "image", "name", "price", "rating", "reviews", "slug", "tags", "type", "unit", "updatedAt", "verified") SELECT "aiScore", "category", "city", "createdAt", "id", "image", "name", "price", "rating", "reviews", "slug", "tags", "type", "unit", "updatedAt", "verified" FROM "Professional";
DROP TABLE "Professional";
ALTER TABLE "new_Professional" RENAME TO "Professional";
CREATE UNIQUE INDEX "Professional_slug_key" ON "Professional"("slug");
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CityWaitlist_email_city_key" ON "CityWaitlist"("email", "city");
