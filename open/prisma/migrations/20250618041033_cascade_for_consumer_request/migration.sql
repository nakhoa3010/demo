-- DropForeignKey
ALTER TABLE "consumer_request" DROP CONSTRAINT "consumer_request_consumer_id_fkey";

-- AddForeignKey
ALTER TABLE "consumer_request" ADD CONSTRAINT "consumer_request_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
