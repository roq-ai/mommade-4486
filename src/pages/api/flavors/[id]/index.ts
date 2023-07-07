import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { flavorValidationSchema } from 'validationSchema/flavors';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.flavor
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFlavorById();
    case 'PUT':
      return updateFlavorById();
    case 'DELETE':
      return deleteFlavorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFlavorById() {
    const data = await prisma.flavor.findFirst(convertQueryToPrismaUtil(req.query, 'flavor'));
    return res.status(200).json(data);
  }

  async function updateFlavorById() {
    await flavorValidationSchema.validate(req.body);
    const data = await prisma.flavor.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFlavorById() {
    const data = await prisma.flavor.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
