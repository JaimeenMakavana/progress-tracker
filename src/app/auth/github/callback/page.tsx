"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { githubSync } from "@/services/githubSync";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`GitHub OAuth error: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus("error");
          setMessage("Missing OAuth parameters");
          return;
        }

        const success = await githubSync.handleCallback(code, state);

        if (success) {
          setStatus("success");
          setMessage("Successfully connected to GitHub!");
          // Redirect to main page after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Failed to authenticate with GitHub");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-black mb-2">
              Connecting to GitHub...
            </h1>
            <p className="text-gray-600">
              Please wait while we authenticate your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-black mb-2">Success!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-black mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <button onClick={() => router.push("/")} className="btn-primary">
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-black mb-2">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we process your request.
            </p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
