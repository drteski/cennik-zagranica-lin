/*
  Warnings:

  - You are about to drop the `ProductOnTitles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOnTitles" DROP CONSTRAINT "ProductOnTitles_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnTitles" DROP CONSTRAINT "ProductOnTitles_productTitleId_fkey";

-- DropTable
DROP TABLE "ProductOnTitles";

-- CreateTable
CREATE TABLE "_ProductToProductTitle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTitle_AB_unique" ON "_ProductToProductTitle"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTitle_B_index" ON "_ProductToProductTitle"("B");

-- AddForeignKey
ALTER TABLE "_ProductToProductTitle" ADD CONSTRAINT "_ProductToProductTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTitle" ADD CONSTRAINT "_ProductToProductTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
