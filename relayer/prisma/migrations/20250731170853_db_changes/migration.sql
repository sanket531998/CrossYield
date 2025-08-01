/*
  Warnings:

  - You are about to drop the column `walletAddress` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "crossyield"."User_walletAddress_key";

-- AlterTable
ALTER TABLE "crossyield"."User" DROP COLUMN "walletAddress";

-- CreateTable
CREATE TABLE "crossyield"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "crossyield"."Wallet"("address");

-- AddForeignKey
ALTER TABLE "crossyield"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "crossyield"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
