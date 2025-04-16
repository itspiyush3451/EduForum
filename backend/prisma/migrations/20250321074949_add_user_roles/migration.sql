/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `registrationdate` on the `User` table. All the data in the column will be lost.
  - The `usertype` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userid_fkey";

-- DropForeignKey
ALTER TABLE "Notice" DROP CONSTRAINT "Notice_userid_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userid_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "userid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notice" ALTER COLUMN "userid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "userid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "registrationdate",
ALTER COLUMN "userid" DROP DEFAULT,
ALTER COLUMN "userid" SET DATA TYPE TEXT,
DROP COLUMN "usertype",
ADD COLUMN     "usertype" "UserRole" NOT NULL DEFAULT 'STUDENT',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userid");
DROP SEQUENCE "User_userid_seq";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;
