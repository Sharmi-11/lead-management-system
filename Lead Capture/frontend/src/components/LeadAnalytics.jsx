import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LeadAnalytics = ({ leads }) => {
  const sourceCount = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(sourceCount).map((key) => ({
    source: key,
    count: sourceCount[key],
  }));

  return (
    <div style={{ height: 300 }} className="mb-4">
      <h4>Leads Source</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="source" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadAnalytics;
