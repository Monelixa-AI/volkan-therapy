import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const assessmentSchema = z.object({
  sessionId: z.string().min(1),
  answers: z.record(z.any())
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, answers } = assessmentSchema.parse(body);

    const data = {
      sessionId,
      childAge: answers.childAge || null,
      childGender: answers.childGender || null,
      previousDiagnosis: answers.previousDiagnosis || null,
      concernAreas: Array.isArray(answers.concernAreas) ? answers.concernAreas : [],
      soundSensitivity: answers.soundSensitivity || null,
      touchSensitivity: answers.touchSensitivity || null,
      eyeContact: answers.eyeContact || null,
      sittingDifficulty: answers.sittingDifficulty || null,
      anxietyLevel: answers.anxietyLevel || null,
      letterConfusion: answers.letterConfusion || null,
      playBehavior: answers.playBehavior || null,
      routineReaction: answers.routineReaction || null,
      motorSkills: answers.motorSkills || null,
      teacherFeedback: answers.teacherFeedback || null,
      mainConcern: answers.mainConcern || null,
      mediaUrls: [] as string[],
      status: "IN_PROGRESS" as const
    };

    await prisma.assessment.upsert({
      where: { sessionId },
      update: data,
      create: data
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment create error:", error);
    return NextResponse.json(
      { error: "Değerlendirme kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}