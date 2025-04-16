/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Notice` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `User` table. All the data in the column will be lost.
  - Added the required column `departmentid` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentid` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentid` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Notice" DROP CONSTRAINT "Notice_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departmentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "departmentId",
ADD COLUMN     "departmentid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "id",
ADD COLUMN     "departmentid" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("departmentid");

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "departmentId",
ADD COLUMN     "departmentid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "departmentId",
ADD COLUMN     "departmentid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "departmentId",
ADD COLUMN     "departmentid" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "Department"("departmentid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "Department"("departmentid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "Department"("departmentid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "Department"("departmentid") ON DELETE CASCADE ON UPDATE CASCADE;
