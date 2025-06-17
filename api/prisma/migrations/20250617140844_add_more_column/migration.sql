-- AlterTable
ALTER TABLE "consumer_request" ADD COLUMN     "amount" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "balance" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "service" TEXT NOT NULL DEFAULT 'VRF';
