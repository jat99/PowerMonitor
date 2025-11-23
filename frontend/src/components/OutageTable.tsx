import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  export interface OutageData {
    id: string
    startTime: string
    endTime: string | null
    duration: string
    status: "Active" | "Resolved"
    voltageBefore: number
    voltageAfter: number | null
    cause?: string
  }
  
  export interface OutageTableProps {
    data?: OutageData[]
    title?: string
  }
  
  // Mock outage data
  const mockOutages: OutageData[] = [
    {
      id: "OUT001",
      startTime: "2024-01-15 14:23:00",
      endTime: "2024-01-15 14:45:00",
      duration: "22 min",
      status: "Resolved",
      voltageBefore: 120.5,
      voltageAfter: 120.2,
      cause: "Grid maintenance",
    },
    {
      id: "OUT002",
      startTime: "2024-01-14 08:15:00",
      endTime: "2024-01-14 09:30:00",
      duration: "1h 15min",
      status: "Resolved",
      voltageBefore: 119.8,
      voltageAfter: 120.1,
      cause: "Equipment failure",
    },
    {
      id: "OUT003",
      startTime: "2024-01-13 22:00:00",
      endTime: null,
      duration: "Ongoing",
      status: "Active",
      voltageBefore: 121.0,
      voltageAfter: null,
      cause: "Unknown",
    },
    {
      id: "OUT004",
      startTime: "2024-01-12 16:45:00",
      endTime: "2024-01-12 17:00:00",
      duration: "15 min",
      status: "Resolved",
      voltageBefore: 120.3,
      voltageAfter: 120.0,
      cause: "Weather related",
    },
    {
      id: "OUT005",
      startTime: "2024-01-11 10:30:00",
      endTime: "2024-01-11 11:00:00",
      duration: "30 min",
      status: "Resolved",
      voltageBefore: 120.1,
      voltageAfter: 119.9,
      cause: "Grid maintenance",
    },
    {
      id: "OUT006",
      startTime: "2024-01-10 03:15:00",
      endTime: "2024-01-10 03:25:00",
      duration: "10 min",
      status: "Resolved",
      voltageBefore: 120.4,
      voltageAfter: 120.3,
      cause: "Equipment failure",
    },
    {
      id: "OUT007",
      startTime: "2024-01-09 19:20:00",
      endTime: "2024-01-09 20:10:00",
      duration: "50 min",
      status: "Resolved",
      voltageBefore: 119.7,
      voltageAfter: 120.0,
      cause: "Weather related",
    },
    {
      id: "OUT008",
      startTime: "2024-01-08 12:00:00",
      endTime: "2024-01-08 12:45:00",
      duration: "45 min",
      status: "Resolved",
      voltageBefore: 120.2,
      voltageAfter: 120.1,
      cause: "Grid maintenance",
    },
    {
      id: "OUT009",
      startTime: "2024-01-07 06:30:00",
      endTime: null,
      duration: "Ongoing",
      status: "Active",
      voltageBefore: 120.6,
      voltageAfter: null,
      cause: "Unknown",
    },
    {
      id: "OUT010",
      startTime: "2024-01-06 15:10:00",
      endTime: "2024-01-06 15:20:00",
      duration: "10 min",
      status: "Resolved",
      voltageBefore: 120.0,
      voltageAfter: 119.8,
      cause: "Equipment failure",
    },
  ]
  
  function formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  export function OutageTable({ data = mockOutages, title = "Outage History" }: OutageTableProps) {
    return (
      <Card className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-3 pb-3 sm:pb-0">
            <CardTitle className="text-base md:text-lg">{title}</CardTitle>
            <CardDescription>
              Power outage history and active outages
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-0 sm:px-6 sm:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Voltage Before</TableHead>
                <TableHead>Voltage After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((outage) => (
                <TableRow key={outage.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        outage.status === "Active"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {outage.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDateTime(outage.startTime)}</TableCell>
                  <TableCell>
                    {outage.endTime ? formatDateTime(outage.endTime) : "-"}
                  </TableCell>
                  <TableCell>{outage.duration}</TableCell>
                  <TableCell>{outage.voltageBefore}V</TableCell>
                  <TableCell>
                    {outage.voltageAfter ? `${outage.voltageAfter}V` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
  