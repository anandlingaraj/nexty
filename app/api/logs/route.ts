import { LogFilter } from '@/app/admin/logs/types';
import { buildLogQuery } from '@/lib/log-utils';
import { prisma } from '@/lib/prisma';
import { parseSearchQuery } from '@/utils/logSearch';
import { type NextRequest } from 'next/server';



export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const filters = search ? parseSearchQuery(search) : {};

    const logs = await prisma.log.findMany({
      where: buildLogQuery(filters),
      skip: (page - 1) * limit,
      take: limit,
      include: {
          user: {
              select: {
                  name: true,
                  email: true
              }
          }
      },
      orderBy: { timestamp: 'desc' },
    });
    const total = await prisma.log.count();
    return Response.json({
        logs,
        total,
        pages: Math.ceil(total / limit)
    });
}

export async function POST(request: Request) {
    const logData = await request.json();

    const log = await prisma.log.create({
        data: logData
    });

    return Response.json(log);
}
