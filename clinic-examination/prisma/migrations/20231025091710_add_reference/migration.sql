/*
  Warnings:

  - A unique constraint covering the columns `[patient_id]` on the table `Diagnostic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patient_id` to the `Diagnostic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diagnostic" ADD COLUMN     "patient_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Patient_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Diagnostic_patient_id_key" ON "Diagnostic"("patient_id");

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
