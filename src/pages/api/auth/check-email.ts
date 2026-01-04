// src/pages/api/auth/check-email.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return res.status(200).json({ exists: !!user })
  } catch (error) {
    console.error('Check email error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
