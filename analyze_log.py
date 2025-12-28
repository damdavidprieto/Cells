import json
import sys

try:
    with open(r"C:\Proyectos\rare\Cells\logs\cells_dev_run_PRESSURE_OXYGEN_2025-12-25T21-00-24.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Run ID: {data.get('run_id')}")
    
    events = data.get('events', [])
    print(f"\nTotal Events: {len(events)}")
    for e in events:
        if e['type'] in ['reproduction', 'death', 'mutation']:
            print(f"Event: {e['type']} at Frame {e['frame_number']} - {e.get('data')}")

    stats = data.get('frame_stats', [])
    print(f"\nTotal Stats Frames: {len(stats)}")
    # Print first 5 and last 5
    for s in stats[:5]:
        print(f"Stat: Frame {s['frame_number']} | Pop: {s['population']} | Energy: {s['avg_energy']}")
    print("...")
    for s in stats[-5:]:
        print(f"Stat: Frame {s['frame_number']} | Pop: {s['population']} | Energy: {s['avg_energy']}")

except Exception as e:
    print(f"Error: {e}")
