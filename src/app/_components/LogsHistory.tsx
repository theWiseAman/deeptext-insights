import React from 'react'
import  prisma from '@/utilities/dbInit'
import { LogDetails } from '../_interfaces/logModel'

const LogsHistory = async () => {
  const logs = await prisma.log.findMany()

  return (
    <section>
      <h2>Log History</h2>
      <p>Log History content goes here</p>
      {
        logs.map((log: LogDetails) => (
          <div key={log.id}>
            <h3>User Input</h3>
            <p>{log.userInput}</p>
            <h3>LLM Response</h3>
            <p>{log.llmResponse}</p>
            <h3>Vectara Score</h3>
            <p>{log.vectaraScore}</p>
            <h3>Education Score</h3>
            <p>{log.educationScore}</p>
          </div>
        ))
      }
    </section>
  )
}

export default LogsHistory