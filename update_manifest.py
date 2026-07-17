import json
import os
import urllib.parse

category = os.environ["CATEGORY"]
tema = os.environ["TEMA"]
release = os.environ["RELEASE"]
owner = os.environ["OWNER"]
repo = os.environ["REPO"]
json_file = os.environ["JSON_FILE"]

def safe_filename(name):
    import re
    import unicodedata

    name = unicodedata.normalize("NFKD", name)
    name = name.encode("ascii", "ignore").decode("ascii")
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    return name + ".mp4"

with open(json_file, "r", encoding="utf-8") as f:
    source = json.load(f)

manifest_path = "manifest.json"

if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
else:
    manifest = source

for cat in manifest:
    if cat["category"] != category:
        continue

    for t in cat["temas"]:
        if t["name"] != tema:
            continue

        for video in t["videos"]:
            filename = safe_filename(video["name"])

            encoded = urllib.parse.quote(filename)

            video["url"] = (
                f"https://github.com/"
                f"{owner}/{repo}/releases/download/"
                f"{release}/{encoded}"
            )

with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("manifest.json updated")