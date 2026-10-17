import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/*
 * GET /api/visits
 *
 * Returns all home visits with the
 * associated mother's basic information.
 */
export async function GET() {
  try {
    const visits = await prisma.visit.findMany({
      orderBy: [
        {
          date: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
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

    const formattedVisits = visits.map((visit) => ({
      id: visit.id,
      motherId: visit.motherId,

      motherName: visit.mother.name,

      village:
        visit.mother.village ||
        'Rampura',

      date: visit.date,
      time: visit.time,

      status:
        visit.status === 'completed'
          ? 'completed'
          : 'pending',

      notes:
        visit.notes ||
        'Routine ANC home screening visit.',

      bpLogged:
        visit.bpLogged || undefined,

      weightLogged:
        visit.weightLogged || undefined,

      hbLogged:
        visit.hbLogged || undefined,

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
    }));

    return NextResponse.json({
      success: true,
      count: formattedVisits.length,
      visits: formattedVisits,
    });
  } catch (error) {
    console.error(
      'Get visits error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to fetch visits.',
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * POST /api/visits
 *
 * Creates a new home visit.
 */
export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      motherId,
      date,
      time,
      notes,
    } = body;

    if (!motherId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Mother ID is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Visit date is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (!time) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Visit time is required.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Make sure the mother actually exists.
     */
    const mother =
      await prisma.mother.findUnique({
        where: {
          id: motherId,
        },
      });

    if (!mother) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Mother not found.',
        },
        {
          status: 404,
        }
      );
    }

    const visit =
      await prisma.visit.create({
        data: {
          motherId,
          date,
          time,
          status: 'pending',
          notes:
            notes ||
            'Routine ANC home screening visit.',
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

    return NextResponse.json(
      {
        success: true,

        visit: {
          id: visit.id,
          motherId: visit.motherId,

          motherName:
            visit.mother.name,

          village:
            visit.mother.village ||
            'Rampura',

          date: visit.date,
          time: visit.time,
          status: visit.status,

          notes:
            visit.notes ||
            'Routine ANC home screening visit.',

          isDemo: false,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      'Create visit error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to create visit.',
      },
      {
        status: 500,
      }
    );
  }
}