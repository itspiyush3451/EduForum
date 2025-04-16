/*
  Warnings:

  - Added the required column `departmentId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "departmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "departmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "departmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
