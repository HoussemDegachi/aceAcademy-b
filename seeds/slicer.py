import fitz
import os

import fitz.fitz


def create_dir(dir: str) -> None:
    '''
        Creates a new directory if it doesn't already exist
    '''

    if not os.path.exists(dir):
        os.mkdir(dir)

def get_cords(file: str) -> list:
    '''
    Gets a file path as a string and returns all the cordinates of the word exercice case incencetive that occure in the file.
    '''
    doc = fitz.open(file)
    exe_cords = []
    for page_n, page in enumerate(doc):
        word_list = page.get_text_words()
        for word_i, word in enumerate(word_list):
            try:
                print(word[4])
            except:
                print("")
            print("__________________")
            if ("exercice" == word[4].lower() or "ex" == word[4].lower()) or (does_form("ex", word_list, word_i) or does_form("exercise", word_list, word_i)):
                data = {
                    "page": page_n,
                    "cord": (word[0], word[1], word[2], word[3]),

                }
                exe_cords.append(data)
    print(exe_cords)
    doc.close()
    return exe_cords

def does_form(word, list, of):
    to = of + len(word) - 1

    # verify length
    if to >= len(list):
        return False
    
    res = True
    for i in range(of, to + 1):
        print(i)
        if word[i-of].lower() != list[i][4].lower():
            res = False

    return res
    


def split(file: str, output: str, cords: list):
    doc = fitz.open(file)
    exercices_files = []
    for page_n, page in enumerate(doc):
        page_dimentions = page.cropbox
        saves = 0
        for cord_i, cord in enumerate(cords):
            if page_n == cord["page"]:
                crop_cords = fitz.Rect(0, cord["cord"][1], page_dimentions[2], page_dimentions[3])

                if not((cord_i + 1 < len(cords) and cords[cord_i + 1]["page"] != page_n) or cord_i + 1 == len(cords)):
                    print("met")
                    crop_cords[3] = cords[cord_i + 1]["cord"][3] -14
                saves += 1

                new_file_path = f"{output}/{page_n}-{cord_i}.pdf"
                exercices_files.append({"path": new_file_path, "page": page_n})
                open(new_file_path, "w")
                print(crop_cords)
                page.set_cropbox(crop_cords)
                doc.save(new_file_path)
    doc.close()
    return exercices_files

def pdf_to_png(input: str, output: str=None):
    with fitz.open(input) as doc:
        page = doc[0]
        pixmap = page.get_pixmap(matrix=fitz.Matrix(0)) 
        if not output:
            output = input.replace('.pdf', '.png')
        pixmap.save(output)
        return output



def join_pages(target, other):
    with fitz.open(other) as doc2:
        doc2_words = doc2[0].get_text_words()
        if  not (("exercice" == doc2_words[0][4].lower() or "ex" == doc2_words[0][4].lower()) and ("n" == doc2_words[1][4].lower() or doc2_words[1][4].isnumeric())):
            with fitz.open(target) as doc1: 
                page1_size = doc1[0].cropbox
                page2_size = doc2[0].cropbox
                page1_height = page1_size[3] - page1_size[1]
                new_height = page1_height + (page2_size[3] - page2_size[1])
                new_page = doc1.new_page(-1, width=page1_size[2], height=new_height)
                slice1_png = pdf_to_png(target)
                slice2_png = pdf_to_png(other)
                new_page.insert_image(fitz.Rect(0, 0, page1_size[2], page1_height), filename=slice1_png)
                new_page.insert_image(fitz.Rect(0, page1_height, page1_size[2], new_height), filename=slice2_png)
                doc1.select([1])
                doc1.saveIncr()
                os.remove(slice1_png)
                os.remove(slice2_png)
    

def trim(files):
    deleted = []
    for i, file in enumerate(files):
        with fitz.open(file["path"]) as doc:
            doc.select([file["page"]])
            doc.saveIncr()

            # if i != 0 and files[i - 1]["page"] != file["page"]:
            #     join_pages(files[i - 1]["path"], file["path"])
            #     deleted.append(file)

    # for deleted_file in deleted:
    #     os.remove(deleted_file["path"])
    #     files.remove(deleted_file)

    return files


def slicer(file_name:str, dest_name:str):
    create_dir(dest_name)
    cords = get_cords(file_name)
    files = split(file_name, dest_name, cords)
    return trim(files)