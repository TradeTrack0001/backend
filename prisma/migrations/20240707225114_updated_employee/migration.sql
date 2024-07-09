/*
  Warnings:

  - Added the required column `CompanyEmail` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `QuantityAdded` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `QuantityTook` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "CompanyEmail" TEXT NOT NULL,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "QuantityAdded" INTEGER NOT NULL,
ADD COLUMN     "QuantityTook" INTEGER NOT NULL;
