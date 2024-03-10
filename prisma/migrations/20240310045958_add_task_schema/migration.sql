-- CreateEnum
CREATE TYPE "TASK_STATUS" AS ENUM ('NEW', 'ACTIVE', 'RESOLVED', 'QA', 'COMPLETED');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TASK_STATUS" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdUser" TEXT NOT NULL,
    "assignUser" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_key" ON "Task"("id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdUser_fkey" FOREIGN KEY ("createdUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignUser_fkey" FOREIGN KEY ("assignUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
