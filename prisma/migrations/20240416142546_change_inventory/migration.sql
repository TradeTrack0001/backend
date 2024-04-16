/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "inventory" (
    "itemID" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "itemQuantity" INTEGER NOT NULL,
    "itemStatus" BOOLEAN NOT NULL,
    "itemSize" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "checkInDate" TEXT NOT NULL,
    "checkOutDate" TEXT NOT NULL DEFAULT 'N/A',
    "location" TEXT NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("itemID")
);
