import os
import re
import sys
import yaml
import subprocess

def extract_coords(body):
    # Google Maps: q=LAT%2CLON
    gmaps_match = re.search(r'q=([0-9.-]+)%2C([0-9.-]+)', body)
    if gmaps_match:
        return float(gmaps_match.group(1)), float(gmaps_match.group(2))

    # OSM: #map=ZOOM/LAT/LON
    # Example: https://www.openstreetmap.org/#map=19/51.10482/13.77569
    osm_match = re.search(r'map=[0-9]+/([0-9.-]+)/([0-9.-]+)', body)
    if osm_match:
        return float(osm_match.group(1)), float(osm_match.group(2))

    # Raw: LAT, LON
    # Match something like "51.104815, 13.775685"
    raw_match = re.search(r'([0-9.-]+)\s*,\s*([0-9.-]+)', body)
    if raw_match:
        return float(raw_match.group(1)), float(raw_match.group(2))

    return None, None

def main():
    title = os.environ.get('ISSUE_TITLE', '').strip()
    body = os.environ.get('ISSUE_BODY', '').strip()

    if not title:
        with open('error.txt', 'w') as f:
            f.write("Issue title is empty.")
        sys.exit(1)

    lat, lon = extract_coords(body)

    if lat is None or lon is None:
        with open('error.txt', 'w') as f:
            f.write("Could not extract coordinates from issue body. Please provide a Google Maps link, OSM link, or raw coordinates (lat, lon).")
        sys.exit(1)

    # Round to 3 decimal places (~111m precision)
    lat = round(lat, 3)
    lon = round(lon, 3)

    yaml_path = '_data/geopoints.yml'
    geopoints = []
    if os.path.exists(yaml_path):
        with open(yaml_path, 'r') as f:
            try:
                geopoints = yaml.safe_load(f) or []
            except yaml.YAMLError as exc:
                with open('error.txt', 'w') as f_err:
                    f_err.write(f"Error parsing {yaml_path}: {exc}")
                sys.exit(1)

    # Check for duplicates
    for point in geopoints:
        if point.get('name') == title:
            with open('error.txt', 'w') as f:
                f.write(f"Location with name '{title}' already exists.")
            sys.exit(1)
        # Check coordinates with 3 decimal place precision
        try:
            p_lat = round(float(point.get('latitude', 0)), 3)
            p_lon = round(float(point.get('longitude', 0)), 3)
            if p_lat == lat and p_lon == lon:
                with open('error.txt', 'w') as f:
                    f.write(f"Location with coordinates ({lat}, {lon}) already exists (name: {point.get('name')}).")
                sys.exit(1)
        except (ValueError, TypeError):
            continue

    # Append new point by writing directly to file to preserve formatting
    with open(yaml_path, 'a+') as f:
        f.seek(0, os.SEEK_END)
        size = f.tell()
        if size > 0:
            f.seek(size - 1)
            last_char = f.read(1)
            if last_char != '\n':
                f.write('\n')

        f.write(f"- name: {title}\n")
        f.write(f"  latitude: {lat}\n")
        f.write(f"  longitude: {lon}\n")

    # Git operations
    try:
        subprocess.run(['git', 'config', '--local', 'user.email', 'action@github.com'], check=True)
        subprocess.run(['git', 'config', '--local', 'user.name', 'GitHub Action'], check=True)
        subprocess.run(['git', 'add', yaml_path], check=True)
        subprocess.run(['git', 'commit', '-m', f'feat: add new location {title}'], check=True)
        subprocess.run(['git', 'push'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")
        # If we are in a mock environment or git push fails, we might still want to proceed if it's just testing
        if os.environ.get('GITHUB_ACTIONS') == 'true':
             sys.exit(1)

if __name__ == '__main__':
    main()
