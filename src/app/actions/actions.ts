"use server"

import prisma from "@/utilities/dbInit";
import { revalidatePath } from "next/cache";

const addLog = async (formData: FormData) => {
  console.log(formData);
  await prisma.log.create({
    data: {
      userInput: formData.get('userInput') as string,
      llmResponse: formData.get('userInput') as string,
      vectaraScore: 0.5,
      educationScore: 0.5
    }
  })

  revalidatePath('/logs')
}

export {
  addLog
}