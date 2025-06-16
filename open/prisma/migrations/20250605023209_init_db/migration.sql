-- CreateTable
CREATE TABLE "feeds" (
    "feed_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "adapter_id" INTEGER NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("feed_id")
);

-- CreateTable
CREATE TABLE "adapters" (
    "adapter_id" SERIAL NOT NULL,
    "adapter_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,

    CONSTRAINT "adapters_pkey" PRIMARY KEY ("adapter_id")
);

-- CreateTable
CREATE TABLE "aggregators" (
    "aggregator_id" SERIAL NOT NULL,
    "aggregator_hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "heartbeat" INTEGER NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "absolute_threshold" DOUBLE PRECISION NOT NULL,
    "adapter_id" INTEGER NOT NULL,
    "fetcher_type" INTEGER NOT NULL DEFAULT 0,
    "chain_id" INTEGER NOT NULL,
    "name_hash" TEXT,

    CONSTRAINT "aggregators_pkey" PRIMARY KEY ("aggregator_id")
);

-- CreateTable
CREATE TABLE "data" (
    "data_id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "value" BIGINT NOT NULL,
    "aggregator_id" INTEGER NOT NULL,
    "feed_id" INTEGER NOT NULL,

    CONSTRAINT "data_pkey" PRIMARY KEY ("data_id")
);

-- CreateTable
CREATE TABLE "aggregates" (
    "aggregate_id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "value" BIGINT NOT NULL,
    "aggregator_id" INTEGER NOT NULL,

    CONSTRAINT "aggregates_pkey" PRIMARY KEY ("aggregate_id")
);

-- CreateTable
CREATE TABLE "chains" (
    "chain_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("chain_id")
);

-- CreateTable
CREATE TABLE "reporters" (
    "address" VARCHAR(42) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "oracleAddress" VARCHAR(42) NOT NULL,
    "privateKey" VARCHAR(164) NOT NULL,
    "reporter_id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "reporters_pkey" PRIMARY KEY ("reporter_id")
);

-- CreateTable
CREATE TABLE "services" (
    "name" TEXT NOT NULL,
    "service_id" SERIAL NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "listeners" (
    "listener_id" SERIAL NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "event_name" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "listeners_pkey" PRIMARY KEY ("listener_id")
);

-- CreateTable
CREATE TABLE "vrf_keys" (
    "vrf_key_id" SERIAL NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "key_hash" VARCHAR(256) NOT NULL,
    "pk" VARCHAR(256) NOT NULL,
    "pk_x" VARCHAR(256) NOT NULL,
    "pk_y" VARCHAR(256) NOT NULL,
    "sk" VARCHAR(256) NOT NULL,

    CONSTRAINT "vrf_keys_pkey" PRIMARY KEY ("vrf_key_id")
);

-- CreateTable
CREATE TABLE "chain_rpc" (
    "id" SERIAL NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "rpc_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chain_rpc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adapters_adapter_hash_key" ON "adapters"("adapter_hash");

-- CreateIndex
CREATE UNIQUE INDEX "aggregators_aggregator_hash_key" ON "aggregators"("aggregator_hash");

-- CreateIndex
CREATE UNIQUE INDEX "aggregators_name_key" ON "aggregators"("name");

-- CreateIndex
CREATE INDEX "aggregates_aggregator_id_timestamp_idx" ON "aggregates"("aggregator_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "chains_name_key" ON "chains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_adapter_id_fkey" FOREIGN KEY ("adapter_id") REFERENCES "adapters"("adapter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregators" ADD CONSTRAINT "aggregators_adapter_id_fkey" FOREIGN KEY ("adapter_id") REFERENCES "adapters"("adapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregators" ADD CONSTRAINT "aggregators_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("chain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_aggregator_id_fkey" FOREIGN KEY ("aggregator_id") REFERENCES "aggregators"("aggregator_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("feed_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_aggregator_id_fkey" FOREIGN KEY ("aggregator_id") REFERENCES "aggregators"("aggregator_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporters" ADD CONSTRAINT "reporters_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("chain_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporters" ADD CONSTRAINT "reporters_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listeners" ADD CONSTRAINT "listeners_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("chain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listeners" ADD CONSTRAINT "listeners_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrf_keys" ADD CONSTRAINT "vrf_keys_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("chain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chain_rpc" ADD CONSTRAINT "chain_rpc_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("chain_id") ON DELETE RESTRICT ON UPDATE CASCADE;
