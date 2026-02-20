import { useState } from "react";
import { applyToJob } from "../api";
import "./JobItem.css";

function JobItem({ job, uuid, candidateId, canSubmit, submitDisabledReason }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit() {
    setMessage("");
    setIsError(false);

    if (!canSubmit) {
      setMessage(submitDisabledReason);
      setIsError(true);
      return;
    }

    if (!repoUrl) {
      setMessage("Ingresa la URL del repositorio.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      await applyToJob({
        uuid,
        jobId: job.id,
        candidateId,
        repoUrl,
      });

      setMessage("Postulacion enviada correctamente.");
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="job-card">
      <h3 className="job-title">{job.title}</h3>

      <input
        type="text"
        placeholder="https://github.com/tu-usuario/tu-repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="job-input"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !canSubmit}
        className="job-button"
      >
        {loading ? "Enviando..." : "Submit"}
      </button>

      {message && (
        <p className={`job-message ${isError ? "job-error" : "job-success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default JobItem;
