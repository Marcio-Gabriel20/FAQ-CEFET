/*
  Warnings:

  - Added the required column `questionCategory` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('ADMISSION', 'COURSES', 'SCHEDULES', 'OTHER');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionCategory" "QuestionCategory" NOT NULL DEFAULT 'OTHER';
