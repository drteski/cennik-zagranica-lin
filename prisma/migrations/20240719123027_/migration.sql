-- CreateTable
CREATE TABLE "Alias" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "alias" INTEGER,
    "parent" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryName" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "lang" TEXT NOT NULL,
    "text" TEXT,

    CONSTRAINT "CategoryName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "freeTransport" BOOLEAN NOT NULL DEFAULT false,
    "variantId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "ean" TEXT NOT NULL,
    "brandId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTitle" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "lang" TEXT NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "oldPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceDifference" DOUBLE PRECISION NOT NULL,
    "priceDifferenceAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "iso" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingList" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "MailingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToProductTitle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailToMailingList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_variantId_key" ON "Product"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTitle_AB_unique" ON "_ProductToProductTitle"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTitle_B_index" ON "_ProductToProductTitle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailToMailingList_AB_unique" ON "_EmailToMailingList"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailToMailingList_B_index" ON "_EmailToMailingList"("B");

-- AddForeignKey
ALTER TABLE "CategoryName" ADD CONSTRAINT "CategoryName_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingList" ADD CONSTRAINT "MailingList_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTitle" ADD CONSTRAINT "_ProductToProductTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTitle" ADD CONSTRAINT "_ProductToProductTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailToMailingList" ADD CONSTRAINT "_EmailToMailingList_A_fkey" FOREIGN KEY ("A") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailToMailingList" ADD CONSTRAINT "_EmailToMailingList_B_fkey" FOREIGN KEY ("B") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
