-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crossyield";

-- CreateTable
CREATE TABLE "crossyield"."User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."Intent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "riskTolerance" TEXT NOT NULL,
    "minApy" DOUBLE PRECISION NOT NULL,
    "preferredChains" TEXT[],
    "autoExecute" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "hashlock" TEXT,
    "secret" TEXT,
    "timelock" TIMESTAMP(3),
    "isRefunded" BOOLEAN,
    "isRedeemed" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "Intent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."HTLC" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "hashlock" TEXT NOT NULL,
    "secret" TEXT,
    "timelock" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "chain" TEXT NOT NULL,
    "unlockTxHash" TEXT,

    CONSTRAINT "HTLC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."APYResult" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "apy" DOUBLE PRECISION NOT NULL,
    "tvlUsd" DOUBLE PRECISION NOT NULL,
    "project" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION,
    "protocolId" TEXT,

    CONSTRAINT "APYResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."Protocol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "website" TEXT,
    "riskScore" DOUBLE PRECISION,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."ExecutionLog" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "executedBy" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "gasUsed" DOUBLE PRECISION NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'success',
    "htlcId" TEXT,

    CONSTRAINT "ExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crossyield"."AuthEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginMethod" TEXT NOT NULL,
    "ipAddress" TEXT,
    "loggedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "crossyield"."User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "HTLC_intentId_key" ON "crossyield"."HTLC"("intentId");

-- AddForeignKey
ALTER TABLE "crossyield"."Intent" ADD CONSTRAINT "Intent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "crossyield"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."HTLC" ADD CONSTRAINT "HTLC_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "crossyield"."Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."APYResult" ADD CONSTRAINT "APYResult_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "crossyield"."Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."APYResult" ADD CONSTRAINT "APYResult_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "crossyield"."Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."ExecutionLog" ADD CONSTRAINT "ExecutionLog_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "crossyield"."Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."ExecutionLog" ADD CONSTRAINT "ExecutionLog_htlcId_fkey" FOREIGN KEY ("htlcId") REFERENCES "crossyield"."HTLC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crossyield"."AuthEvent" ADD CONSTRAINT "AuthEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "crossyield"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
