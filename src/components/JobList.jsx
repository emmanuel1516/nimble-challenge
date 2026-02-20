import JobItem from "./JobItem";
import "./JobList.css";

function JobList({
  jobs,
  uuid,
  candidateId,
  applicationId,
  canSubmit,
  submitDisabledReason,
}) {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobItem
          key={job.id}
          job={job}
          uuid={uuid}
          candidateId={candidateId}
          applicationId={applicationId}
          canSubmit={canSubmit}
          submitDisabledReason={submitDisabledReason}
        />
      ))}
    </div>
  );
}

export default JobList;
