-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "bpLogged" TEXT,
    "weightLogged" DOUBLE PRECISION,
    "hbLogged" DOUBLE PRECISION,
    "medsCompliant" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_motherId_idx" ON "Visit"("motherId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
