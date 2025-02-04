"use server"

import prisma from "@/utilities/dbInit";
import { revalidatePath } from "next/cache";

const addLog = async (formData: FormData) => {
  try {
    const userInput = formData.get('userInput') as string
    const url = 'http://localhost:8000/api/v1/llmScore'
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        userInput: userInput
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.status != 200) {
      throw new Error(data.detail)
    }
    await prisma.log.create({
      data: {
        userInput: data.userInput,
        llmResponse: data.llmResponse,
        vectaraScore: data.vectaraScore,
        educationScore: data.educationScore,
      }
    })
  } catch (e) {
    console.log(e)
    // return Response.json({
    //   message: "LLM Score API failed",
    //   error: e.message
    // })
  }
  revalidatePath('/')
  revalidatePath('/logs')
}

export {
  addLog
}