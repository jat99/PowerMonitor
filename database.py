import sqlite3
import pandas as pd

OUTAGE_STATUS_ACTIVE = "Active"
OUTAGE_STATUS_RESOLVED = "Resolved"

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('database.db')
        self.conn.row_factory = sqlite3.Row 
        self.c = self.conn.cursor()
    
    def create_outages_table(self):
        self.c.execute(
            """
            CREATE TABLE IF NOT EXISTS outages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time TEXT,
                end_time TEXT,
                date TEXT,
                status TEXT,
                voltage_before REAL,
                voltage_after REAL
            )
            """
        )
        self.conn.commit()
        print("Created outages table")

    def create_measurements_table(self):
        self.c.execute(
            """
            CREATE TABLE IF NOT EXISTS measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                voltage REAL,
                current REAL,
                power REAL,
                energy REAL,
                pf REAL
            )
            """
        )
        self.conn.commit()
        print("Created measurements table")

    #* Mutators
    def create_outage(
        self, 
        start_time: str, 
        date: str, 
        voltage_before: float
    ):
        status = OUTAGE_STATUS_ACTIVE
        voltage_after = None
        end_time = None

        self.c.execute(
            """
            INSERT INTO outages (start_time, end_time, date, status, voltage_before, voltage_after)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (start_time, end_time, date, status, voltage_before, voltage_after)
        )
        self.conn.commit()

    def resolve_outage(
        self, 
        end_time: str, 
        voltage_after: float
    ): 
        status = OUTAGE_STATUS_RESOLVED
        self.c.execute(
            """
            UPDATE outages
            SET end_time = ?, status = ?, voltage_after = ?
            WHERE id = (SELECT MAX(id) FROM outages)
            """,
            (end_time, status, voltage_after)
        )
        self.conn.commit()  # <-- Missing before!

    def insert_measurement(
        self, 
        timestamp: str, 
        voltage: float, 
        current: float, 
        power: float, 
        energy: float, 
        pf: float
    ): 
        self.c.execute(
            """
            INSERT INTO measurements (timestamp, voltage, current, power, energy, pf)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (timestamp, voltage, current, power, energy, pf)
        )
        self.conn.commit()

    def insert_many_measurements(self, measurements: list[dict]):
        self.c.executemany(
            """
            INSERT INTO measurements (timestamp, voltage, current, power, energy, pf)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            measurements
        )
        self.conn.commit()
    #* Getters

    def get_outages(self):
        self.c.execute("SELECT * FROM outages")
        rows = self.c.fetchall()
        return [dict(row) for row in rows]

    def get_measurements(self):
        self.c.execute("SELECT * FROM measurements")
        rows = self.c.fetchall()
        return [dict(row) for row in rows]
    
    def get_last_hour_measurements(self):
        self.c.execute(
            """
            SELECT * FROM measurements
            WHERE timestamp >= datetime('now', '-1 hour')
            """
        )
        rows = self.c.fetchall()
        return [dict(row) for row in rows]

    def get_last_24_hours_measurements(self):
        self.c.execute(
            """
            SELECT * FROM measurements
            WHERE timestamp >= datetime('now', '-24 hours')
            """
        )
        rows = self.c.fetchall()
        return [dict(row) for row in rows]
        
    #* Helpers
    def close(self):
        self.conn.close()


if __name__ == "__main__":
    db = Database()
    db.create_outages_table()
    db.create_measurements_table()

    # db.create_outage(
    #     start_time="2025-01-01 12:00:00",
    #     date="2025-01-01",
    #     voltage_before=120.0
    # )

    # # Must pass parameters to resolve_outage()
    # db.resolve_outage(
    #     end_time="2025-01-01 12:30:00",
    #     voltage_after=118.0
    # )

    # db.insert_measurement(
    #     timestamp="2025-01-01 12:00:00",
    #     voltage=120.0,
    #     current=10.0,
    #     power=1200.0,
    #     energy=1200.0,
    #     pf=0.9
    # )
    # for i in range(10):
    #     db.create_outage(
    #         start_time=f"2025-01-01 12:00:00 + {i} hours",
    #         date="2025-01-01",
    #         voltage_before=120.0
    #     )
    #     db.resolve_outage(
    #         end_time=f"2025-01-01 12:00:00 + {i} hours",
    #         voltage_after=118.0
    #     )
    print(db.get_outages())
    print(db.get_measurements())
    db.close()