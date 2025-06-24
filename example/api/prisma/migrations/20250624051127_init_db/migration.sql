-- CreateTable
CREATE TABLE "flip_coin_history" (
    "id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "bet" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flip_coin_history_pkey" PRIMARY KEY ("id")
);
