# PowerMonitor

A real-time power monitoring system that tracks voltage, current, power, energy consumption, and power outages. The system consists of an ESP32 embedded device that samples electrical measurements, a FastAPI backend that processes and stores data, and a React frontend dashboard for visualization.

## Features

- **Embedded Data Collection**: ESP32 Arduino-based sensor that samples current and voltage in real-time
- **Real-time Monitoring**: Live charts for voltage, current, power, and energy consumption
- **Outage Detection**: Automatic detection and reporting of power outages with voltage measurements
- **Timed Data Transmission**: Scheduled data transmission from embedded device to backend
- **Historical Data**: View historical measurements and outage history
- **Responsive Dashboard**: Modern, responsive UI built with React and Tailwind CSS
- **RESTful API**: FastAPI backend with SQLite database for data persistence

## Tech Stack

### Embedded
- **ESP32** - Microcontroller with WiFi connectivity
- **Arduino Framework** - Embedded programming platform
- **Current/Voltage Sensors** - Hardware sensors for electrical measurements

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - Lightweight database for data storage
- **Pandas** - Data manipulation and analysis
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives

## Project Structure

```
PowerMonitor/
├── embedded/              # ESP32 Arduino code
│   └── (ESP32 firmware)   # Sensor sampling and data transmission
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── CurrentChart.tsx
│   │   │   ├── EnergyChart.tsx
│   │   │   ├── OutageTable.tsx
│   │   │   ├── PowerChart.tsx
│   │   │   └── VoltageChart.tsx
│   │   ├── lib/           # Utility functions
│   │   │   ├── api.ts     # API client for backend
│   │   │   └── utils.ts   # Helper functions
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── dist/              # Built frontend files
│   └── package.json
├── database.py            # Database models and operations
├── server.py              # FastAPI server
├── requirements.txt       # Python dependencies
└── README.md
```

## System Architecture

The PowerMonitor system follows a three-tier architecture:

1. **Embedded Layer (ESP32)**: 
   - Samples current and voltage measurements at regular intervals
   - Detects power outages by monitoring voltage levels
   - Transmits timed measurement data to the backend API
   - Sends outage notifications when power interruptions are detected

2. **Backend Layer (FastAPI)**:
   - Receives measurement data from ESP32 devices
   - Processes and stores data in SQLite database
   - Handles outage records (creation and resolution)
   - Serves RESTful API endpoints for data retrieval
   - Serves the frontend application

3. **Frontend Layer (React)**:
   - Displays real-time and historical data in interactive charts
   - Shows outage history in a table format
   - Provides responsive dashboard for monitoring

## Installation

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm
- Arduino IDE (for ESP32 development)
- ESP32 development board
- Current and voltage sensors

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Initialize the database:
```bash
python database.py
```

This will create the SQLite database (`database.db`) and necessary tables.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Embedded Setup

1. Install Arduino IDE and ESP32 board support:
   - Follow the [ESP32 Arduino Setup Guide](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)

2. Install required Arduino libraries:
   - WiFi (included with ESP32)
   - HTTPClient (included with ESP32)
   - ArduinoJson (for JSON serialization)

3. Configure WiFi credentials and API endpoint in the ESP32 code

4. Upload the firmware to your ESP32 device

## Running the Application

### Development Mode

1. **Start the backend server** (from project root):
```bash
uvicorn server:app --reload --port 8001
```

The API will be available at `http://localhost:8001`

2. **Start the frontend dev server** (from `frontend/` directory):
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Production Mode

1. **Build the frontend**:
```bash
cd frontend
npm run build
```

2. **Start the backend server**:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

The FastAPI server will serve both the API and the built frontend files.

## API Endpoints

### GET Endpoints

- `GET /api/outages?start_date={date}&end_date={date}` - Get outages for a date range
- `GET /api/outages?date={date}` - Get outages for a specific date

### POST Endpoints

- `POST /api/outage` - Create a new outage record (used by ESP32)
- `POST /api/measurements` - Submit measurement data (used by ESP32)

## API Configuration

The frontend API client (`frontend/src/lib/api.ts`) automatically detects the environment:
- **Development**: Uses `http://localhost:8001/api`
- **Production**: Uses `https://powermonitor.app/api`

## Database Schema

### Outages Table
- `id` - Primary key
- `start_time` - Outage start timestamp
- `end_time` - Outage end timestamp (nullable)
- `date` - Date of outage
- `status` - "Active" or "Resolved"
- `voltage_before` - Voltage before outage
- `voltage_after` - Voltage after outage (nullable)

### Measurements Table
- `id` - Primary key
- `timestamp` - Measurement timestamp
- `voltage` - Voltage reading
- `current` - Current reading
- `power` - Power reading
- `energy` - Energy reading
- `pf` - Power factor

## Embedded System

The ESP32 embedded device is responsible for:

- **Sensor Sampling**: Continuously samples current and voltage from connected sensors
- **Outage Detection**: Monitors voltage levels to detect power outages
- **Data Transmission**: Sends measurement data to the backend API at regular intervals
- **Outage Reporting**: Immediately notifies the backend when an outage is detected or resolved

### Data Flow

1. ESP32 samples sensors at configured intervals (e.g., every second)
2. Measurements are buffered and sent to `/api/measurements` endpoint
3. When voltage drops below threshold, ESP32 sends outage start to `/api/outage`
4. When power is restored, ESP32 sends outage resolution with voltage measurements
5. Backend stores all data in SQLite database
6. Frontend polls or receives updates to display real-time data

## Development

### Frontend Development

- Run linter: `npm run lint`
- Preview production build: `npm run preview`

### Backend Development

The FastAPI server includes:
- CORS middleware for cross-origin requests
- Static file serving for frontend assets
- Automatic API documentation at `/docs` (Swagger UI)

### Embedded Development

- Use Arduino IDE or PlatformIO for ESP32 development
- Serial monitor for debugging
- Test API endpoints using the backend's Swagger UI at `/docs`

## License

This project is private and proprietary.
