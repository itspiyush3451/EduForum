/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Department` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departmentId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `departmentId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Notice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
