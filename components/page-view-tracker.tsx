'use client'

import { useEffect } from 'react'
import { logEvent } from '@/lib/analytics'

type Props = {
  page: string
  meta?: Record<string, any>
}

export function PageViewTracker({ page, meta }: Props) {
  useEffect(() => {
    logEvent('page_view', { page, ...meta })
  }, [page, meta])

  return null
}
