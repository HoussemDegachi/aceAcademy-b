from slicer import slicer, pdf_to_png
from corrector import get_correction
from scraper import get_devoirat, download
import shutil
import json
import os

def main():
    # get tests
    url = "https://www.devoirat.net/maths/s%C3%A9ries-maths/2%C3%A8me-ann%C3%A9e-sciences/"
    base = "https://www.devoirat.net"
    header("Step1: Getting tests")
    tests = get_devoirat(url, base)
    tests = {
        "Energie_et_controle": ["https://www.devoir.tn/secondaire/Doc/2-%C3%A8me-ann%C3%A9es/Sciences/Physique/S%C3%A9ries/Liste-1/s%C3%A9rie-n%C2%B0-27-travail-d-une-force-puissance-1.pdf", "https://www.devoir.tn/secondaire/Doc/2-%C3%A8me-ann%C3%A9es/Sciences/Physique/S%C3%A9ries/Liste-1/s%C3%A9rie-n%C2%B0-28-travail-d-une-force-puissance-2.pdf"],
        "optique": ["https://www.devoir.tn/secondaire/Doc/2-%C3%A8me-ann%C3%A9es/Sciences/Physique/S%C3%A9ries/Liste-1/s%C3%A9rie-n%C2%B0-30-r%C3%A9flexion-et-r%C3%A9fraction-de-la-lumi%C3%A8re.pdf"],
    }

    print(tests)
    print("tests scraped successfully")

    # download tests
    download_tests(tests)

    # slice tests
    log = slice_tests(tests)

    # transform to png
    log = transform_png(log)

    # get tests correction and text
    # log = corrector(log)

    # save to JSON
    with open("data1.json", "w") as file:
        log = json.dumps(log)
        file.write(log)


def download_tests(tests):
    header("step2: downloading pdf tests")
    for lesson in tests:
        print(f"downloading {lesson} tests")
        dir_path = f"temp1/{lesson}"
        os.mkdir(dir_path)
        for i, test in enumerate(tests[lesson]):
            print(f"downloading test {i}/{len(tests) - 1} of {lesson}")
            file_dir = f"{dir_path}/{i}"
            download(test, f"{file_dir}.pdf")
            print(f"test {i} downloaded successfully at {file_dir}")

    print("All tests downloaded successfully")

def slice_tests(lessons):
    header("Step3: Slicing lessons")
    log = {}
    lost = 0
    saved = 0
    total = 0
    for lesson in lessons:
        log[lesson] = {"exercises": []}
        for i, test in enumerate(lessons[lesson]):
            print(f"slicing {i} of {len(lessons[lesson]) - 1}")
            target_file = f"temp1/{lesson}/{i}.pdf"
            new_dir = f"temp1/{lesson}/{i}"
            res = slicer(target_file, new_dir)
            print(res)
            print(f"sliced {i} of {lesson} successfully")
            for change in res:
                log[lesson]["exercises"].append(change["path"])
            saved += 1
            os.remove(target_file)
            total += 1
    
    print(f"{saved} of {total} lessons sliced successfully, {lost} lost")

    return log

def transform_png(log):
    header("Step4: transforming to png")
    for lesson in log:
        print(f"Transforming {lesson} items to png")
        exercises = log[lesson]["exercises"]
        for i, exercise in enumerate(exercises):
            print(f"transforming {i} of {lesson}")
            new_name = pdf_to_png(exercise)
            os.remove(exercise)
            log[lesson]["exercises"][i] = new_name
            print(f"transformed {i} of {lesson} successfully")
        print(f"Transformed {lesson} items to png successfully")
    return log

def corrector(log):
    header("Step 5: getting corrections")
    for lesson in log:
        print(f"correcting {lesson}")
        exercises = log[lesson]["exercises"]
        log[lesson]["corrections"] = []
        for i, exercise in enumerate(exercises):
            print(f"correcint {i} of {lesson}")
            try:
                cor = get_correction(exercise)
            except:
                continue
            finally:
                log[lesson]["exercises"].pop(i)
            os.remove(exercise)
            print(cor)
            if cor:
                log[lesson]["exercises"].append(cor["ex"])
                log[lesson]["corrections"].append(cor["cor"])

            print(f"corrected {i} of lesson successfully")
        print(f"corrected {lesson} successfully")
    return log

def header(text:str):
    print("----------------")
    print(text)

def config():
    os.mkdir("temp1")

def unconfig():
    shutil.rmtree("temp1")


try:
    config()
    main()
except Exception as e:
    print("An error occured")
    print("Undoing changes")
    unconfig()
    print(e)