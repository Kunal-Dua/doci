/*
  Warnings:

  - Added the required column `role` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocRole" AS ENUM ('OWNER', 'VIEWER', 'EDITOR');

-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "role" "DocRole" NOT NULL;
