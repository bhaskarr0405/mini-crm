const STATUS_LABEL = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
  lost: 'Lost'
};

export default function LeadTable({ leads, onSelect }) {
  if (leads.length === 0) {
    return (
      <div className="lead-table">
        <div className="empty-state">No leads match this view yet.</div>
      </div>
    );
  }

  return (
    <table className="lead-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Source</th>
          <th>Status</th>
          <th>Received</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id} onClick={() => onSelect(lead)}>
            <td>
              <div className="lead-name">{lead.name}</div>
              <div className="lead-email">{lead.email}</div>
            </td>
            <td>{lead.source}</td>
            <td>
              <span className={`status-pill status-${lead.status}`}>
                <span className="pipeline-dot" />
                {STATUS_LABEL[lead.status]}
              </span>
            </td>
            <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
