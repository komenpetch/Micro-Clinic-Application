-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('OPD', 'ER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" "VisitType" NOT NULL,
    "gender" "Gender",

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
