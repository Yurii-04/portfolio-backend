/*
  Warnings:

  - Added the required column `about_project` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "about_project" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "role" TEXT NOT NULL;
