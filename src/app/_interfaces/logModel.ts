import { ColumnDef } from "@tanstack/react-table"

export interface LogDetails {
  id: number;
  userInput: string;
  llmResponse: string;
  vectaraScore: number;
  educationScore: number;
  createdAt: Date;
}

export const columns: ColumnDef<LogDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userInput",
    header: "User Input",
  },
  {
    accessorKey: "llmResponse",
    header: "LLM Response",
  },
  {
    accessorKey: "vectaraScore",
    header: "Vectara Score",
  },
  {
    accessorKey: "educationScore",
    header: "Education Score",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
]