/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_Email_key" ON "employee"("Email");
