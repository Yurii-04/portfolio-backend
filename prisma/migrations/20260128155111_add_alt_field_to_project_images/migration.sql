/*
  Warnings:

  - Added the required column `alt` to the `project_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_images" ADD COLUMN     "alt" TEXT NOT NULL;
