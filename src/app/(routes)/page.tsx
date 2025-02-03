import Link from "next/link";
import { addLog } from "../actions/actions";

export default function Home() {
  return (
    <>
      <nav className="flex flex-row justify-between items-center w-full px-8 py-4 bg-zinc-900 text-white">
        <h2>DeepText Insights</h2>
        <ul className="flex flex-row gap-4">
          <li>
            <Link href="/logs" className="hover:underline">Logs</Link>
          </li>
        </ul>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-screen text-background font-[family-name:var(--font-geist-sans)]">
        <form action={addLog} className="flex flex-col gap-8 items-center sm:items-start">
          <input type="text" name="userInput" className="px-4 py-2 rounded-full" placeholder="Ask about a topic" />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Submit
          </button>
        </form>
        {/* <Footer /> */}
      </main>
    </>
  );
}
