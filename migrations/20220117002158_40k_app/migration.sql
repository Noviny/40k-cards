-- CreateTable
CREATE TABLE "WeaponProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "range" TEXT NOT NULL DEFAULT E'',
    "type" TEXT NOT NULL,
    "shots" TEXT NOT NULL DEFAULT E'',
    "AP" TEXT NOT NULL DEFAULT E'',
    "dmg" TEXT NOT NULL DEFAULT E'',
    "strength" TEXT NOT NULL DEFAULT E'',
    "notes" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "WeaponProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitStat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "M" TEXT NOT NULL DEFAULT E'',
    "WS" TEXT NOT NULL DEFAULT E'',
    "BS" TEXT NOT NULL DEFAULT E'',
    "S" TEXT NOT NULL DEFAULT E'',
    "A" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "UnitStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "details" TEXT NOT NULL DEFAULT E'',
    "stats" TEXT,
    "points" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "details" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Unit_weapons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Unit_keywords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Unit_abilities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WeaponProfile_name_key" ON "WeaponProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitStat_name_key" ON "UnitStat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE INDEX "Unit_stats_idx" ON "Unit"("stats");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Unit_weapons_AB_unique" ON "_Unit_weapons"("A", "B");

-- CreateIndex
CREATE INDEX "_Unit_weapons_B_index" ON "_Unit_weapons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Unit_keywords_AB_unique" ON "_Unit_keywords"("A", "B");

-- CreateIndex
CREATE INDEX "_Unit_keywords_B_index" ON "_Unit_keywords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Unit_abilities_AB_unique" ON "_Unit_abilities"("A", "B");

-- CreateIndex
CREATE INDEX "_Unit_abilities_B_index" ON "_Unit_abilities"("B");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_stats_fkey" FOREIGN KEY ("stats") REFERENCES "UnitStat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_weapons" ADD FOREIGN KEY ("A") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_weapons" ADD FOREIGN KEY ("B") REFERENCES "WeaponProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_keywords" ADD FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_keywords" ADD FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_abilities" ADD FOREIGN KEY ("A") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Unit_abilities" ADD FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
