import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack';
import { prisma } from '@/lib/prisma';
import { generateProposal, ProposalInput } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body
    const body = await request.json();
    const { brief, template, currency } = body as {
      brief: string;
      template: string;
      currency: string;
    };

    // Validation
    if (!brief || brief.length < 50) {
      return NextResponse.json(
        { error: 'Brief must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (!['consulting', 'development', 'design', 'marketing', 'construction'].includes(template)) {
      return NextResponse.json(
        { error: 'Invalid template' },
        { status: 400 }
      );
    }

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { stackUserId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          stackUserId: user.id,
          email: user.primaryEmail || '',
          name: user.displayName,
        },
      });
    }

    // Generate proposal with AI
    const generated = await generateProposal({
      brief,
      template: template as ProposalInput['template'],
      currency,
    });

    // Save to database
    const proposal = await prisma.proposal.create({
      data: {
        userId: dbUser.id,
        title: generated.title,
        clientName: generated.clientName,
        clientCompany: generated.clientCompany || '',
        brief,
        scope: generated.scope,
        deliverables: generated.deliverables,
        timeline: generated.timeline,
        pricing: generated.pricing,
        terms: generated.terms,
        template,
        currency,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Generate proposal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
