import requests
from bs4 import BeautifulSoup

headers = {
    'Referer': '',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
}

def req(url):
    return requests.get(url, headers=headers) 

def get_devoirat(url, base):
    page = req(url)

    soup = BeautifulSoup(page.content, "html.parser")
    raw_data = soup.find_all(True, {'class':['mg-b10', 'cc-m-download-link']})
    data = {}
    appends = {}
    current = None

    for item in raw_data:

        if "mg-b10" in item.get("class"):
            current = item.text.strip().replace("/", "").replace(" ", "_").lower()
            if "devoir" in current:
                break
            data[current] = []
            appends[current] = 0

        else:
            if appends[current] < 5:
                data[current].append(f"{base}{item.get('href')}")
                appends[current] += 1
    
    return data


def download(url, name):
    response = req(url)
    with open(name, "wb") as file:
        file.write(response.content)