/*
  Warnings:

  - Added the required column `content` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "content" JSONB NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'undefined',
ALTER COLUMN "role" SET DEFAULT 'OWNER';
