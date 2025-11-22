import { VoltageChart } from "@/components/VoltageChart"
import { CurrentChart } from "@/components/CurrentChart"
import { PowerChart } from "@/components/PowerChart"
import { EnergyChart } from "@/components/EnergyChart"
import { OutageTable } from "@/components/OutageTable"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Power Monitor Dashboard</CardTitle>
            <CardDescription className="text-base">
              Real-time monitoring of voltage, current, power, and energy consumption
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <VoltageChart title="Voltage Monitor" />
          <CurrentChart title="Current Monitor" />
          <PowerChart title="Power Monitor" />
          <EnergyChart title="Energy Monitor" />
        </div>
        <OutageTable />
      </div>
    </div>
  )
}

export default App