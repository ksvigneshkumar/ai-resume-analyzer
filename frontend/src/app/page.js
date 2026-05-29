"use client";

import { useState } from "react";

export default function Home() {

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e) => {

    const selectedFiles = [...e.target.files];

    const validFiles = selectedFiles.filter((file) => {

      return (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

    });

    if (validFiles.length !== selectedFiles.length) {

      setError("Only PDF and DOCX files are allowed");
      setFiles([]);
      return;

    }

    setError("");
    setFiles(validFiles);
  };

  const uploadResumes = async () => {

    if (files.length === 0) {

      setError("Please select resume files");
      return;

    }

    setLoading(true);
    setError("");

    try {

      const allResults = await Promise.all(

        files.map(async (file) => {

          const formData = new FormData();
          formData.append("resume", file);

          const response = await fetch(
            "http://127.0.0.1:8000/upload/",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          return {
            name: file.name,
            qualified: data.qualified,
            score: data.score,
            matched_skills: data.matched_skills,
            missing_skills: data.missing_skills,
            summary: data.summary,
          };

        })

      );

      setResults(allResults);

    } catch (error) {

      setError("Something went wrong");

    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-center text-cyan-400 mb-10">
        AI Resume Analyzer
      </h1>

      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-10 shadow-2xl">

        <h2 className="text-3xl font-bold text-yellow-400 mb-4">
          Python Full Stack Developer
        </h2>

        <p className="text-gray-300 mb-6">
          Upload resumes to analyze candidate skills using AI.
        </p>

        <div className="mb-8">

          <h3 className="text-xl font-bold text-cyan-400 mb-4">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {[
              "Python",
              "Django",
              "REST API",
              "SQL",
              "Git",
              "JavaScript",
              "React",
              "HTML",
              "CSS",
              "Node.js",
            ].map((skill) => (

              <span
                key={skill}
                className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-semibold"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="flex flex-col items-center gap-5">

          <label className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-xl text-black font-bold cursor-pointer">

            Choose Resume Files

            <input
              type="file"
              multiple
              hidden
              onChange={handleFiles}
            />

          </label>

          <p className="text-gray-300">
            {files.length} File Selected
          </p>

          <button
            onClick={uploadResumes}
            disabled={loading}
            className="bg-green-500 hover:bg-green-400 transition px-10 py-4 rounded-xl text-black font-bold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload Resume"}
          </button>

          {error && (
            <p className="text-red-400 font-semibold">
              {error}
            </p>
          )}

        </div>

      </div>

      {loading && (

        <div className="flex flex-col items-center mt-10">

          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

          <p className="mt-5 text-cyan-300 text-xl">
            AI is analyzing resumes...
          </p>

        </div>

      )}

      <div className="mt-10 space-y-8">

        {results.map((item, index) => (

          <div
            key={index}
            className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-xl"
          >

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              {item.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              <div className="space-y-5">

                <p className="text-lg">

                  <span className="font-bold text-yellow-400">
                    Qualified :
                  </span>{" "}

                  {item.qualified ? (

                    <span className="text-green-400 font-bold">
                      YES
                    </span>

                  ) : (

                    <span className="text-red-400 font-bold">
                      NO
                    </span>

                  )}

                </p>

                <p className="text-lg">

                  <span className="font-bold text-yellow-400">
                    Total Score :
                  </span>{" "}

                  <span className="text-cyan-300 font-bold">
                    {item.score}/100
                  </span>

                </p>

                <div>

                  <h3 className="font-bold text-green-400 mb-2">
                    Matched Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {item.matched_skills.map((skill, i) => (

                      <span
                        key={i}
                        className="bg-green-500 text-black px-3 py-2 rounded-lg font-semibold"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                </div>

                <div>

                  <h3 className="font-bold text-red-400 mb-2">
                    Missing Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {item.missing_skills.map((skill, i) => (

                      <span
                        key={i}
                        className="bg-red-500 text-black px-3 py-2 rounded-lg font-semibold"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                </div>

              </div>

              <div>

                <h3 className="text-xl font-bold text-cyan-400 mb-4">
                  AI Summary
                </h3>

                <div className="bg-black border border-zinc-700 rounded-2xl p-5">

                  <p className="text-gray-300 leading-8">
                    {item.summary}
                  </p>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}