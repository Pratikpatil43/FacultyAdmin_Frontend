import React from 'react';

const BranchSelector = ({ branches, branch, setBranch }) => {
  return (
    <div className="mb-3">
      <label htmlFor="branch" className="form-label">Branch</label>
      <select
        id="branch"
        className="form-control"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      >
        <option value="">Select Branch</option>
        {branches.map((b, index) => (
          <option key={index} value={b}>{b}</option>
        ))}
      </select>
    </div>
  );
};

const ClassSelector = ({ classes, className, setClassName }) => {
  return (
    <div className="mb-3">
      <label htmlFor="className" className="form-label">Class</label>
      <select
        id="className"
        className="form-control"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((c, index) => (
          <option key={index} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

const SubjectSelector = ({ subjects, subject, setSubject }) => {
  return (
    <div className="mb-3">
      <label htmlFor="subject" className="form-label">Subject</label>
      <select
        id="subject"
        className="form-control"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">Select Subject</option>
        {subjects.map((s, index) => (
          <option key={index} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
};

export { BranchSelector, ClassSelector, SubjectSelector };
