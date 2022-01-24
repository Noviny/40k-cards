/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "hideName" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");
