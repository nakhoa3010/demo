-- AlterTable
ALTER TABLE "prepayment_account" ADD COLUMN     "consumerId" INTEGER;

-- CreateTable
CREATE TABLE "consumer" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "acc_id" INTEGER NOT NULL,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "spend_count" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_fulfillment" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumer_request" (
    "id" SERIAL NOT NULL,
    "consumer_id" INTEGER NOT NULL,
    "request_id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumer_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumer_address_key" ON "consumer"("address");

-- AddForeignKey
ALTER TABLE "consumer" ADD CONSTRAINT "consumer_acc_id_fkey" FOREIGN KEY ("acc_id") REFERENCES "prepayment_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumer_request" ADD CONSTRAINT "consumer_request_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
