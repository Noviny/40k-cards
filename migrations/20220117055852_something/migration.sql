-- CreateTable
CREATE TABLE "Stratagem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "details" TEXT NOT NULL DEFAULT E'',
    "CP" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Stratagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmyList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "description" TEXT NOT NULL DEFAULT E'',
    "notes" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ArmyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArmyList_units" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArmyList_stratagems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Stratagem_name_key" ON "Stratagem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArmyList_units_AB_unique" ON "_ArmyList_units"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmyList_units_B_index" ON "_ArmyList_units"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArmyList_stratagems_AB_unique" ON "_ArmyList_stratagems"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmyList_stratagems_B_index" ON "_ArmyList_stratagems"("B");

-- AddForeignKey
ALTER TABLE "_ArmyList_units" ADD FOREIGN KEY ("A") REFERENCES "ArmyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmyList_units" ADD FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmyList_stratagems" ADD FOREIGN KEY ("A") REFERENCES "ArmyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmyList_stratagems" ADD FOREIGN KEY ("B") REFERENCES "Stratagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
