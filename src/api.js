const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getApiErrorMessage(data, fallback) {
  const baseMessage = data?.error || data?.message || fallback;
  const fieldErrors = data?.details?.fieldErrors;

  if (!fieldErrors || typeof fieldErrors !== "object") {
    return baseMessage;
  }

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (Array.isArray(messages)) {
      const firstMessage = messages.find(
        (message) => typeof message === "string" && message.trim()
      );

      if (firstMessage) {
        return `${baseMessage} (${field}: ${firstMessage})`;
      }

      continue;
    }

    if (typeof messages === "string" && messages.trim()) {
      return `${baseMessage} (${field}: ${messages})`;
    }
  }

  return baseMessage;
}

export async function getCandidateByEmail(email) {
  const response = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${email}`
  );

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Error fetching candidate"));
  }

  return data;
}

export async function getJobs() {
  const response = await fetch(`${BASE_URL}/api/jobs/get-list`);
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Error fetching jobs"));
  }

  return data;
}

export async function applyToJob(body) {
  const response = await fetch(
    `${BASE_URL}/api/candidate/apply-to-job`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Error applying to job"));
  }

  return data;
}
