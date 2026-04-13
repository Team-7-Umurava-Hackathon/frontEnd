import { jobs } from "../../../data/jobs";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary">{job.title}</h1>

        <p className="text-gray-500 mt-2">{job.company}</p>

        <p className="mt-6 text-gray-700">{job.description}</p>

        {/* Experience */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Experience</h2>
          <p className="mt-2 text-gray-700">{job.experience}</p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-lightBlue text-primary text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        

        {/* Requirements */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Requirements</h2>
          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
            <h2 className="text-xl font-semibold text-primary">Application Deadline</h2>
            <p className="mt-2 text-red-500">{job.deadline}</p>
        </div>
        <Link href={`/jobs/${job.id}/apply`}>
        <button className="mt-8 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition">
          Apply Now
        </button>
        </Link>
      </div>
    </div>
  );
}