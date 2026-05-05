/*
  Warnings:

  - You are about to drop the column `text` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `message` table. All the data in the column will be lost.
  - Added the required column `role` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `text`,
    DROP COLUMN `type`,
    ADD COLUMN `formSnapshot` JSON NULL,
    ADD COLUMN `parentId` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('USER', 'ASSISTANT') NOT NULL;
