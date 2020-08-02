import os
import math
import logging
import sys
import uuid
import json

import cv2
import argparse

# Configurations
log = logging.getLogger(__name__)
log.setLevel("DEBUG")

# GLOBALS
TEXT_COLOR = (0,0,255)
FONT_FACE = cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 2/3.5
TEXT_WEIGHT = 3

# Functions
def write_text(image, text, x1, y1, x2, y2):
    text = str(text)
    total_width = math.hypot(x2 - x1, y2 - y1)
    text_size = cv2.getTextSize(text, FONT_FACE, FONT_SCALE, 1)
    text_width = text_size[0][0]

    text_x = x1
    if total_width > text_width:
        text_x = x1 + int((total_width - text_width)/2)
    text_y = y1 - 5
    image = cv2.putText(image, text, (text_x, text_y), FONT_FACE, FONT_SCALE, TEXT_COLOR, 1, cv2.LINE_AA)
    return image

def paste_seal(image):
    seal_fullpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public/diginitt_seal.jpeg")
    seal = cv2.imread(seal_fullpath)
    seal = cv2.resize(seal, (0,0), fx=0.35, fy=0.35)
    seal_height, seal_width, _ = seal.shape 

    image_height, image_width, _ = image.shape
    image_x = image_width - seal_width - 20
    image_y = image_height - seal_height - 20
    
    image[image_y:image_y+seal_height, image_x:image_x+seal_width, :] = seal[0:seal_height, 0:seal_width, :]
    return image

def paste_qr(image, qr_path):
    qr = cv2.imread(qr_path)
    qr = cv2.resize(qr, (0,0), fx=0.99, fy=0.99)
    qr_height, qr_width, _ = qr.shape

    image_height, image_width, _ = image.shape
    image_x = 20
    image_y = image_height - qr_height - 20
    
    image[image_y:image_y+qr_height, image_x:image_x+qr_width, :] = qr[0:qr_height, 0:qr_width, :]
    return image


# Main Function
def main():
    parser = argparse.ArgumentParser(
        description="Application form blank detection and certificate generation",
        epilog="""
            Sample command:
            python3 form_script.py --filepath="~/form3.jpg" --type="generate" --data="hello,world"
        """)
    parser.add_argument('-t','--type', help='count -> Count the number of blanks / generate -> Certification generation', required=True, default="count")
    parser.add_argument('-f','--filepath', help='Filepath of the application form', required=True)
    parser.add_argument('-d','--data', help='Data for certificate population', required=False)
    parser.add_argument('-qr','--qr', help="Filepath of the QR", required=False)

    args = None
    try:
        args = vars(parser.parse_args())
    except:
        parser.print_help()
        sys.exit(0)

    t = args["type"]
    filepath = args["filepath"]
    pop_data = args["data"]
    if t=='generate':
        if pop_data != None:
            pop_data = pop_data.split(',')
        
    
    log.debug("Execution type: " + t)
    log.debug("Filepath: " + filepath)

    if (t != "count" and t != "generate") or (not filepath):
        log.error("Invalid arguments!")
        log.error("Exiting...")       
        sys.exit(0)
    image = cv2.imread(filepath)
    image = image.astype('uint8')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    edges = cv2.Canny(gray, 70, 500)
    lines = cv2.HoughLinesP(image=edges, 
                            rho=1e-4, 
                            theta=math.pi/2, 
                            threshold=30, 
                            minLineLength=30, 
                            maxLineGap=10e-20)
    y_dev = 5
    x_dev = 20

    blanks_count = 0 
    y_pts = {}
    ordered_pts = []
    for i in range(len(lines)):
        req = lines[i]
        for j in range(len(req)):
            line = req[j]
            x1 = line[0]
            y1 = line[1]
            x2 = line[2]
            y2 = line[3]
            ins = True

            for y in range(y1-y_dev, y1+y_dev):
                if y in y_pts:
                    for x_coords in y_pts[y]:
                        X1 = x_coords[0]
                        X2 = x_coords[1]
                        if abs(X1 - x1) < x_dev or abs(X2 - x2) < x_dev:
                            ins = False
                            break
            if ins:
                if y1 not in y_pts:
                    y_pts[y1] = [[x1, x2]]
                else:
                    y_pts[y1].append([x1, x2])
                
                if t == "count":
                    cv2.line(image, (x1,y1), (x2,y2), TEXT_COLOR, TEXT_WEIGHT)
                blanks_count += 1

    sorted_items = sorted(y_pts.items())

    for item in sorted_items:
        y = item[0]
        x_s = item[1]
        for x in x_s:
            x1 = x[0]
            x2 = x[1]
            ordered_pts.append([y, x1, x2])

    # Write data to form
    if t == "generate":
        
        for i in range(0, blanks_count):
            text = str(i+1)
            if pop_data != None:
                text = pop_data[i] if i+1 <= len(pop_data) else "Sample data"
            pts = ordered_pts[i] 
            image = write_text(image, text, pts[1], pts[0], pts[2], pts[0])

        # Paste seal
        if args["qr"]:
            image = paste_seal(image)
            image = paste_qr(image, args["qr"])

    log.debug("No. of blanks fields: {0}".format(blanks_count))

    # Save generated certificate
    save_filename = filepath.split('/')[-1]
    if t=='generate':
        save_filename = "{0}.jpg".format(str(uuid.uuid4()))
    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public/generated_files", save_filename)
    save_path = os.path.abspath(save_path)

    log.debug("Generated certificate path: {0}".format(save_path))

    response_data = {
        "blanks": blanks_count,
        "filepath": save_path
    }
    print(json.dumps(response_data))

    cv2.imwrite(save_path, image)
    #cv2.imshow('image', image)
    #cv2.waitKey(0)
    # cv2.destroyAllWindows()

if __name__ == "__main__":
    main()