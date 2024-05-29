from youtubesearchpython import VideosSearch
import json


def main():
    with open("data.json") as file: 
        data = json.load(file)

    for header in data:
        cours_name = header.replace("_", " ")
        res = VideosSearch(f"physique 2 eme science {cours_name} cours taki", limit = 8)
        videos = res.result()["result"]
        for video in videos:
            minutes = int(video["duration"].split(":")[0])
            id = video["id"]
            if video["type"] == "video" and not "part" in video["title"].lower() and 15 <= minutes <= 30:
                data[header]["cours"] = {
                    "video": {
                        "id": id,
                        "link": f"https://www.youtube.com/embed/{id}",
                        "duration": minutes,
                    }
                }
                break
        
    with open("data.json", "w") as file:
        data = json.dumps(data)
        file.write(data)

main()