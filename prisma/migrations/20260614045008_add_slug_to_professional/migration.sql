-- CreateTable
CREATE TABLE "Professional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "unit" TEXT,
    "image" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL,
    "aiScore" INTEGER NOT NULL DEFAULT 80
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientName" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "amount" INTEGER NOT NULL,
    "professionalId" INTEGER NOT NULL,
    CONSTRAINT "Booking_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "professionalId" INTEGER NOT NULL,
    CONSTRAINT "Portfolio_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
