-- CreateTable
CREATE TABLE "Inventory" (
    "itemID" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "itemQuantity" INTEGER NOT NULL,
    "itemStatus" BOOLEAN NOT NULL,
    "itemSize" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "checkInDate" TEXT NOT NULL,
    "checkOutDate" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("itemID")
);
