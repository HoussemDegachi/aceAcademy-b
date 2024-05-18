import PIL.Image
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv("AI_KEY")


model = genai.GenerativeModel('gemini-pro-vision')
genai.configure(api_key=key)


def get_correction(path: str, tries = 0):
    '''
    returns all exercises and their correction in an object
    returns None if it fails to
    '''
    img = PIL.Image.open(path)
    response = model.generate_content(
        ["re-ecrive l'exercice et donnez moi le correction de cette exercice avec l'explication (en latex)", img], stream=True)
    response.resolve()
    data = response.text.split("\n\n")
    ex = []
    cor = []
    isEx = True

    for i, item in enumerate(data):
        if i != 0:
            if "correction" in item.lower() or "corrigé" in item.lower():
                isEx = False
            else:
                if isEx:
                    ex.append(item)
                else:
                    cor.append(item)

    if len(ex) != 0 and len(cor) != 0:
        return {
            "ex": ex,
            "cor": cor
        }
    else:
        if tries == 2:
            return None
        return get_correction(path, tries+1)
