import fs from "fs/promises";
import path from "path";

interface ServiceStatus {
  status: "healthy" | "unhealthy" | "degraded";
  uptime: string;
  lastCheck: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  status: "active" | "resolved";
}

async function getSystemHealth(): Promise<Record<string, ServiceStatus>> {
  const services = ["auth-service", "inventory-service", "payment-service"];
  const healthData: Record<string, ServiceStatus> = {};

  for (const service of services) {
    try {
      const filePath = path.join(process.cwd(), "..", "services", service, "status.json");
      const content = await fs.readFile(filePath, "utf8");
      healthData[service] = JSON.parse(content);
    } catch (error) {
      console.error(`Error reading status for ${service}:`, error);
      healthData[service] = {
        status: "unhealthy",
        uptime: "0%",
        lastCheck: "N/A",
      };
    }
  }
  return healthData;
}

const MOCK_INCIDENTS: Incident[] = [
  { id: "SNT-101", title: "Database Latency Spike in East-1", severity: "critical", status: "active" },
  { id: "SNT-102", title: "Auth Token Expiry Bug", severity: "high", status: "active" },
  { id: "SNT-103", title: "Payment Gateway Timeout", severity: "medium", status: "active" },
];

const MOCK_RESOLVED: Incident[] = [
  { id: "SNT-098", title: "Memory Leak in Inventory Service", severity: "high", status: "resolved" },
  { id: "SNT-099", title: "Broken API Route in User Profile", severity: "medium", status: "resolved" },
  { id: "SNT-100", title: "CSS Grid Alignment Bug", severity: "medium", status: "resolved" },
];

export default async function Home() {
  const health = await getSystemHealth();

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Project Sentinel</h1>
          <p className="text-zinc-400">Autonomous Infrastructure Dashboard</p>
        </div>
        <div className="text-right text-sm text-zinc-500 font-mono">
          SYSTEM TIME: {new Date().toISOString()}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health Section */}
        <section className="md:col-span-3 mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(health).map(([name, data]) => (
              <div key={name} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-zinc-400 font-mono text-sm uppercase">{name.replace("-service", "")}</span>
                  <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    data.status?.toLowerCase() === "healthy" ? "bg-green-500/10 text-green-500" :
                    data.status?.toLowerCase() === "degraded" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                  }`}>
                    {data.status}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{data.uptime}</div>
                <div className="text-xs text-zinc-500 font-mono">Last Check: {data.lastCheck}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Incidents Section */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Active Incidents
          </h2>
          <div className="space-y-3">
            {MOCK_INCIDENTS.map(incident => (
              <div key={incident.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center hover:bg-zinc-800/50 transition-colors">
                <div>
                  <span className="text-xs font-mono text-zinc-500 mr-3">{incident.id}</span>
                  <span className="font-medium">{incident.title}</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  incident.severity === "critical" ? "text-red-500" :
                  incident.severity === "high" ? "text-orange-500" : "text-yellow-500"
                }`}>
                  {incident.severity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resolved by Claude Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Resolved by Claude
          </h2>
          <div className="space-y-3">
            {MOCK_RESOLVED.map(incident => (
              <div key={incident.id} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                <div>
                  <span className="text-xs font-mono text-zinc-500 mr-3">{incident.id}</span>
                  <span className="text-zinc-400 line-through decoration-zinc-600">{incident.title}</span>
                </div>
                <span className="text-green-500 text-xs font-bold">FIXED</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
