import Link from "next/link";
import { addLog } from "../actions/actions";
import VectaraChart from "../_components/VectaraChart";
import EducationChart from "../_components/EducationChart";
import LogsHistory from "../_components/LogsHistory";
import prisma from "@/utilities/dbInit";

const generateChartData = (scores: number[]) => {
  // Calculate histogram bins
  const binSize = 0.1
  const minScore = 0
  const maxScore = Math.max(...scores)
  const binCount = Math.ceil((maxScore - minScore) / binSize)

  const bins = Array.from({ length: binCount }, (_, i) => ({
    range: `${(minScore + i * binSize).toFixed(1)}`,
    frequency: 0,
  }))

  // Populate frequency counts
  scores.forEach((score) => {
    const binIndex = Math.floor((score - minScore) / binSize);
    bins[binIndex].frequency++;
  })

  // Format data for chart
  const chartData = bins.map((bin) => ({
    bin: bin.range,
    frequency: bin.frequency,
  }))

  return chartData
}

const Home = async () => {
  const vectaraScores = await prisma.log.findMany({
    select: {
      vectaraScore: true,
    },
  })
  const vectaraChartData = generateChartData(vectaraScores.map((score: {vectaraScore: number}) => score.vectaraScore))

  const educationScores = await prisma.log.findMany({
    select: {
      educationScore: true,
    },
  })
  const educationChartData = generateChartData(educationScores.map((score: { educationScore: number }) => score.educationScore))

  return (
    <>
      <nav className="flex flex-row justify-between items-center w-full px-8 py-4">
        <h2>DeepText Insights</h2>
        <ul className="flex flex-row gap-4">
          <li>
            <Link href="/logs" className="hover:underline">Logs</Link>
          </li>
        </ul>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <form action={addLog} className="flex flex-col gap-8 items-center sm:items-start">
          <input type="text" name="userInput" className="px-4 py-2 rounded-full" placeholder="Ask about a topic" />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Submit
          </button>
        </form>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
          <VectaraChart chartData={vectaraChartData} />
          <EducationChart chartData={educationChartData} />
        </div>
        <LogsHistory />
      </main>
    </>
  );
}

export default Home