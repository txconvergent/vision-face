import cv2
import numpy as np
import sqlite3

faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml');
cam = cv2.VideoCapture(0);


def createRecord(name, image_name):
    conn = sqlite3.connect("faces.db")

    cmd = "INSERT INTO face_table(name, image_name) Values(" + str(name) + "," + str(image_name) + ")"
    conn.execute(cmd)

    conn.commit()
    conn.close()


name = input('Enter User Name')
image_name = input('Enter Image Path');

sampleNum = 0

while True:
    ret, img = cam.read();
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, 1.3, 5);
    for (x, y, w, h) in faces:
        sampleNum = sampleNum + 1;
        cv2.imwrite("images/" + str(image_name) + ".jpg", gray[y:y + h, x:x + w])
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.waitKey(100);
    cv2.imshow("Face", img);
    cv2.waitKey(1);
    if sampleNum > 20:
        break;
cam.release()
cv2.destroyAllWindows()
