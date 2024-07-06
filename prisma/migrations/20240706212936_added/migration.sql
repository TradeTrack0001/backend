-- CreateTable
CREATE TABLE "employee" (
    "employeeID" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeID")
);

-- CreateTable
CREATE TABLE "logs" (
    "logId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "itemID" INTEGER NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("logId")
);

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "inventory"("itemID") ON DELETE RESTRICT ON UPDATE CASCADE;
