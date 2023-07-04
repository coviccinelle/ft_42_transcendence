/*
  Warnings:

  - You are about to drop the column `social` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "social",
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "Token";

-- DropEnum
DROP TYPE "TokenType";

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
