-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'REALTOR');

-- CreateTable
CREATE TABLE "inventory" (
    "itemID" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "itemQuantity" INTEGER NOT NULL,
    "itemStatus" BOOLEAN NOT NULL,
    "itemSize" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "checkInDate" TEXT NOT NULL,
    "checkOutDate" TEXT NOT NULL DEFAULT 'N/A',
    "location" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "employee" (
    "employeeID" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "CompanyEmail" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeID")
);

-- CreateTable
CREATE TABLE "logs" (
    "logId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "itemID" INTEGER NOT NULL,
    "QuantityTook" INTEGER NOT NULL,
    "QuantityAdded" INTEGER NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("logId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "companyEmail" TEXT NOT NULL DEFAULT '',
    "currentWorkspaceId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkspace" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_Email_key" ON "employee"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkspace_userId_workspaceId_key" ON "UserWorkspace"("userId", "workspaceId");

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentWorkspaceId_fkey" FOREIGN KEY ("currentWorkspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
