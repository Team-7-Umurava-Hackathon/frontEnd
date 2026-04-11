import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center text-center px-6 py-20">
          <h1 className="text-4xl font-bold text-black mv-6">
            AI powered Candidate screening
          </h1>
          <p className="text-gray-600 max-w-xl mv-8">
            Find the best candidates faster with our AI-powered candidate screening tool. Our advanced algorithms analyze resumes and job descriptions to identify the most qualified candidates, saving you time and improving your hiring process.
          </p>
          <div className="flex gap-4 mt-6">
  <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition">
    Login
  </button>

  <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition">
    Jobs
  </button>
</div>
        </div>
    </main>
  );
}
