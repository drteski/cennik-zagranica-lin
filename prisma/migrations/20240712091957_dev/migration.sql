-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnTitles" DROP CONSTRAINT "ProductOnTitles_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnTitles" DROP CONSTRAINT "ProductOnTitles_productTitleId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnTitles" ADD CONSTRAINT "ProductOnTitles_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnTitles" ADD CONSTRAINT "ProductOnTitles_productTitleId_fkey" FOREIGN KEY ("productTitleId") REFERENCES "ProductTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
