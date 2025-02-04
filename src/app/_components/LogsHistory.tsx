import React from 'react'
import  prisma from '@/utilities/dbInit'
import { columns, LogDetails } from '../_interfaces/logModel'
import { DataTable } from './DataTable'

const LogsHistory = async () => {
  const logs: LogDetails[] = await prisma.log.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  return (
    <section>
      <h2>Log History</h2>
      <DataTable columns={columns} data={logs} />
    </section>
  )
}

export default LogsHistory