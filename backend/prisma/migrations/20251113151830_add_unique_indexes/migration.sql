-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserChallengeProgress_userId_challengeId_key" ON "UserChallengeProgress"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserSkillAssessment_userId_skillId_key" ON "UserSkillAssessment"("userId", "skillId");

