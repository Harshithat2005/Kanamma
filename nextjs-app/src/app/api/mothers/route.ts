import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const ML_API_URL = "http://127.0.0.1:8000/predict";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      age,
      phone,
      address,
      village,
      district,
      bloodGroup,
      gravida,
      gestationalWeek,
      weight,
      height,
      hbLevel,
      systolicBP,
      diastolicBP,
      bloodSugar,
      bodyTemp,
      heartRate,
    } = body;

    // ------------------------------------------
    // Validate required fields
    // ------------------------------------------

    if (
      !name ||
      age === undefined ||
      systolicBP === undefined ||
      diastolicBP === undefined ||
      bloodSugar === undefined ||
      bodyTemp === undefined ||
      heartRate === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, age, BP, blood sugar, body temperature and heart rate are required.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // 1. Save mother in PostgreSQL
    // ------------------------------------------

    const mother = await prisma.mother.create({
      data: {
        name: String(name),
        age: Number(age),

        phone: phone ? String(phone) : undefined,
        address: address ? String(address) : undefined,
        village: village ? String(village) : undefined,
        district: district ? String(district) : undefined,
        bloodGroup: bloodGroup ? String(bloodGroup) : undefined,

        gravida:
          gravida !== undefined ? Number(gravida) : undefined,

        gestationalWeek:
          gestationalWeek !== undefined
            ? Number(gestationalWeek)
            : undefined,

        weight:
          weight !== undefined ? Number(weight) : undefined,

        height:
          height !== undefined ? Number(height) : undefined,

        hbLevel:
          hbLevel !== undefined ? Number(hbLevel) : undefined,

        systolicBP: Number(systolicBP),
        diastolicBP: Number(diastolicBP),
        bloodSugar: Number(bloodSugar),
        bodyTemp: Number(bodyTemp),
        heartRate: Number(heartRate),
      },
    });

    // ------------------------------------------
    // 2. Send clinical data to ML service
    // ------------------------------------------

    const mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Age: Number(age),
        SystolicBP: Number(systolicBP),
        DiastolicBP: Number(diastolicBP),
        BS: Number(bloodSugar),
        BodyTemp: Number(bodyTemp),
        HeartRate: Number(heartRate),
      }),
    });

    if (!mlResponse.ok) {
      console.error(
        "ML service returned:",
        mlResponse.status
      );

      return NextResponse.json(
        {
          success: true,
          warning:
            "Mother saved, but ML risk assessment could not be completed.",
          mother,
        },
        { status: 201 }
      );
    }

    const prediction = await mlResponse.json();

    // ------------------------------------------
    // 3. Save risk assessment
    // ------------------------------------------

    const probabilities = prediction.probabilities;

    const riskAssessment =
      await prisma.riskAssessment.create({
        data: {
          motherId: mother.id,

          riskLevel: String(prediction.riskLevel),

          highRiskProbability:
            Number(probabilities["high risk"] ?? 0),

          midRiskProbability:
            Number(probabilities["mid risk"] ?? 0),

          lowRiskProbability:
            Number(probabilities["low risk"] ?? 0),

          modelVersion: "RF-v0.1",
        },
      });

    // ------------------------------------------
    // 4. Return complete result
    // ------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Mother registered and risk assessed successfully.",

        mother,

        riskAssessment: {
          id: riskAssessment.id,
          riskLevel: riskAssessment.riskLevel,
          highRiskProbability:
            riskAssessment.highRiskProbability,
          midRiskProbability:
            riskAssessment.midRiskProbability,
          lowRiskProbability:
            riskAssessment.lowRiskProbability,
          modelVersion:
            riskAssessment.modelVersion,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create mother / risk assessment error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to register mother and perform risk assessment.",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const mothers = await prisma.mother.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        riskAssessments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: mothers.length,
      mothers,
    });
  } catch (error) {
    console.error("Get mothers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mothers.",
      },
      { status: 500 }
    );
  }
}