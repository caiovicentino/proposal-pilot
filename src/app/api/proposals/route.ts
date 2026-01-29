import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { stackUserId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json([]);
    }

    // Get proposals
    const proposals = await prisma.proposal.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        clientName: true,
        clientCompany: true,
        status: true,
        pricing: true,
        template: true,
        createdAt: true,
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
