-- AlterTable
ALTER TABLE "BarberShop" ADD COLUMN     "workingDays" INTEGER[] DEFAULT ARRAY[1,2,3,4,5]::INTEGER[],
ADD COLUMN     "openingTime" TEXT DEFAULT '08:00',
ADD COLUMN     "closingTime" TEXT DEFAULT '18:00',
ADD COLUMN     "appointmentInterval" INTEGER DEFAULT 30;
