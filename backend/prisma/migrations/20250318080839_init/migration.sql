-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "usertype" TEXT NOT NULL,
    "registrationdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "Post" (
    "postid" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postid")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentid" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER NOT NULL,
    "postid" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentid")
);

-- CreateTable
CREATE TABLE "Notice" (
    "noticeid" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("noticeid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("postid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
