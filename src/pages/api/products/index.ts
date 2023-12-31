import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { productValidationSchema } from 'validationSchema/products';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProducts();
    case 'POST':
      return createProduct();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProducts() {
    const data = await prisma.product
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'product'));
    return res.status(200).json(data);
  }

  async function createProduct() {
    await productValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.flavor?.length > 0) {
      const create_flavor = body.flavor;
      body.flavor = {
        create: create_flavor,
      };
    } else {
      delete body.flavor;
    }
    const data = await prisma.product.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
