-- CreateTable
CREATE TABLE "_ArmyList_armyRules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArmyList_armyRules_AB_unique" ON "_ArmyList_armyRules"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmyList_armyRules_B_index" ON "_ArmyList_armyRules"("B");

-- AddForeignKey
ALTER TABLE "_ArmyList_armyRules" ADD FOREIGN KEY ("A") REFERENCES "ArmyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmyList_armyRules" ADD FOREIGN KEY ("B") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
