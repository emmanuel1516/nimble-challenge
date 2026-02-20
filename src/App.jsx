import { useState, useEffect } from "react";
import { getCandidateByEmail, getJobs } from "./api";
import JobList from "./components/JobList";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const canSubmit = Boolean(candidate?.uuid && candidate?.candidateId);

  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  async function handleGetCandidate() {
    setError("");
    setCandidate(null);

    if (!email) {
      setError("Ingresá tu email.");
      return;
    }

    try {
      setLoadingCandidate(true);
      const data = await getCandidateByEmail(email);
      setCandidate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCandidate(false);
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoadingJobs(true);
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingJobs(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Nimble Gravity Challenge</h1>

      <div>
        <input
          type="text"
          placeholder="Ingresá tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="app-input"
        />
        <button
          onClick={handleGetCandidate}
          disabled={loadingCandidate}
          className="app-button"
        >
          {loadingCandidate ? "Buscando..." : "Obtener datos"}
        </button>
      </div>

      {candidate && (
        <p>
          Candidato: {candidate.firstName} {candidate.lastName}
        </p>
      )}

      {loadingJobs && <p>Cargando posiciones...</p>}
      {error && <p className="app-error">{error}</p>}

      {jobs.length > 0 && (
        <JobList
          jobs={jobs}
          uuid={candidate?.uuid}
          candidateId={candidate?.candidateId}
          canSubmit={canSubmit}
          submitDisabledReason="Primero obtene tus datos de candidato con el email."
        />
      )}
    </div>
  );
}

export default App;
