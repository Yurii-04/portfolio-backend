/*
  Warnings:

  - A unique constraint covering the columns `[numericId]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "numericId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_numericId_key" ON "projects"("numericId");
