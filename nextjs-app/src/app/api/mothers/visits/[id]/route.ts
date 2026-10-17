import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/*
 * PATCH /api/visits/[id]
 *
 * Used when the ASHA worker completes a visit
 * and records the screening measurements.
 */
export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const {
      status,
      bpLogged,
      weightLogged,
      hbLogged,
      medsCompliant,
      notes,
    } = body;

    /*
     * Make sure the visit exists.
     */
    const existingVisit =
      await prisma.visit.findUnique({
        where: {
          id,
        },
      });

    if (!existingVisit) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Visit not found.',
        },
        {
          status: 404,
        }
      );
    }

    const isCompleted =
      status === 'completed';

    const visit =
      await prisma.visit.update({
        where: {
          id,
        },

        data: {
          status:
            isCompleted
              ? 'completed'
              : status ||
                existingVisit.status,

          bpLogged:
            bpLogged ??
            existingVisit.bpLogged,

          weightLogged:
            weightLogged !==
            undefined
              ? Number(weightLogged)
              : existingVisit.weightLogged,

          hbLogged:
            hbLogged !== undefined
              ? Number(hbLogged)
              : existingVisit.hbLogged,

          medsCompliant:
            medsCompliant !== undefined
              ? Boolean(
                  medsCompliant
                )
              : existingVisit.medsCompliant,

          notes:
            notes ??
            existingVisit.notes,

          completedAt:
            isCompleted
              ? new Date()
              : existingVisit.completedAt,
        },

        include: {
          mother: {
            select: {
              id: true,
              name: true,
              village: true,
              phone: true,
              gestationalWeek: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,

      visit: {
        id: visit.id,
        motherId:
          visit.motherId,

        motherName:
          visit.mother.name,

        village:
          visit.mother.village ||
          'Rampura',

        date: visit.date,
        time: visit.time,

        status:
          visit.status ===
          'completed'
            ? 'completed'
            : 'pending',

        notes:
          visit.notes ||
          'Home screening completed.',

        bpLogged:
          visit.bpLogged ||
          undefined,

        weightLogged:
          visit.weightLogged ||
          undefined,

        hbLogged:
          visit.hbLogged ||
          undefined,

        medsCompliant:
          visit.medsCompliant ??
          undefined,

        createdAt:
          visit.createdAt.toISOString(),

        completedAt:
          visit.completedAt
            ?.toISOString() ||
          undefined,

        isDemo: false,
      },
    });
  } catch (error) {
    console.error(
      'Update visit error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to update visit.',
      },
      {
        status: 500,
      }
    );
  }
}