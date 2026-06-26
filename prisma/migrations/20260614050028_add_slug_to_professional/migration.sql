/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Professional_slug_key" ON "Professional"("slug");
