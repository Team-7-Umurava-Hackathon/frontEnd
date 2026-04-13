import Link from "next/link";
import { jobs } from "../../data/jobs";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Available Positions
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl shadow-md p-6 border"
          >
            <h2 className="text-xl font-bold text-primary">{job.title}</h2>

            <p className="text-sm text-gray-500 mt-1">{job.company}</p>

            <p className="text-gray-600 mt-4">{job.shortDescription}</p>

            <p className="text-sm text-red-500 mt-2">
                Deadline: {job.deadline}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-lightBlue text-primary text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>


            <Link href={`/jobs/${job.id}`}>
              <button className="mt-6 px-5 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition">
                Check Job
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}