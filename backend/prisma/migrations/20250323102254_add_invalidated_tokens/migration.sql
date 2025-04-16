-- CreateTable
CREATE TABLE "InvalidatedToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvalidatedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvalidatedToken_token_key" ON "InvalidatedToken"("token");

-- CreateIndex
CREATE INDEX "InvalidatedToken_token_idx" ON "InvalidatedToken"("token");

-- CreateIndex
CREATE INDEX "InvalidatedToken_expiresAt_idx" ON "InvalidatedToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "InvalidatedToken" ADD CONSTRAINT "InvalidatedToken_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
