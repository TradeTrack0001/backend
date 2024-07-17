/*
  Warnings:

  - Added the required column `workspaceId` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentWorkspaceId" INTEGER;

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentWorkspaceId_fkey" FOREIGN KEY ("currentWorkspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
