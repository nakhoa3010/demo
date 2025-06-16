-- CreateTable
CREATE TABLE "prepayment_account" (
    "id" INTEGER NOT NULL,
    "account" TEXT NOT NULL,
    "tx_hash" TEXT,
    "owner" TEXT NOT NULL,
    "acc_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prepayment_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_output_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinator_address" TEXT,
    "fulfill_data_request_fn" TEXT,
    "format" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_output_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'adaptor',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_node" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "node_type" TEXT NOT NULL,
    "method_name" TEXT,
    "method_id" INTEGER,
    "input_values" TEXT NOT NULL,
    "adaptor_id" INTEGER,
    "index" INTEGER NOT NULL,
    "output_name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_provider" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "base_url" TEXT NOT NULL,
    "api_key" TEXT,
    "document_link" TEXT,
    "pr_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "creator" TEXT,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "category_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_provider_method" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "method_name" TEXT NOT NULL,
    "method_type" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "input_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "playground_url" TEXT,
    "input_schema" JSONB,
    "output_schema" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_provider_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adcs_adaptor" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "input_schema" JSONB,
    "output_schema" JSONB,
    "core_llm" TEXT,
    "static_context" TEXT,
    "nodes_definition" TEXT,
    "creator" TEXT,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "output_type_id" INTEGER,
    "category_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adcs_adaptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_api_key" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "api_key" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "name" TEXT,
    "wallet_address" TEXT,
    "nonce" INTEGER NOT NULL DEFAULT 0,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "nonce_timestamp" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prepayment_account_account_key" ON "prepayment_account"("account");

-- CreateIndex
CREATE UNIQUE INDEX "adcs_provider_code_key" ON "adcs_provider"("code");

-- CreateIndex
CREATE UNIQUE INDEX "adcs_provider_pr_url_key" ON "adcs_provider"("pr_url");

-- CreateIndex
CREATE UNIQUE INDEX "adcs_adaptor_code_key" ON "adcs_adaptor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_key_api_key_key" ON "user_api_key"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_address_key" ON "user"("wallet_address");

-- AddForeignKey
ALTER TABLE "adcs_node" ADD CONSTRAINT "adcs_node_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "adcs_provider_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adcs_node" ADD CONSTRAINT "adcs_node_adaptor_id_fkey" FOREIGN KEY ("adaptor_id") REFERENCES "adcs_adaptor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adcs_provider" ADD CONSTRAINT "adcs_provider_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "adcs_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adcs_provider_method" ADD CONSTRAINT "adcs_provider_method_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "adcs_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adcs_adaptor" ADD CONSTRAINT "adcs_adaptor_output_type_id_fkey" FOREIGN KEY ("output_type_id") REFERENCES "adcs_output_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adcs_adaptor" ADD CONSTRAINT "adcs_adaptor_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "adcs_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
