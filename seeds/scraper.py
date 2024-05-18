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

    current = None
    for item in raw_data:

        if "mg-b10" in item.get("class"):
            current = item.text.strip().replace("/", "").replace(" ", "_").lower()
            print(current)
            if "devoir" in current:
                break
            data[current] = []

        else:
            data[current].append(f"{base}{item.get('href')}")
    
    return data


def download(url, name):
    response = req(url)
    with open(name, "wb") as file:
        file.write(response.content)