import argparse
import os
import cv2
import torch
from time import time


def ret_bbox(model, img_batch, CONFIDENCE_MINM=0.5):
    # Inference
    start = time()
    results = model(img_batch)

    vehicles = results.xyxy[0]

    # print(results.pandas().xyxy[0])
    # predicted_num=len(len(results.xyxy[0]))
    # print(predicted_num)  # img1 predictions (tensor)
    valid_vehicle = [2, 3, 5, 7]
    CONFIDENCE_MINM = 0.50
    bbox = []
    for image in img_batch:
        bbox_single_image = []
        for vehicle in vehicles:
            if (
                int(vehicle[5].item()) in valid_vehicle
                and vehicle[4].item() > CONFIDENCE_MINM
            ):
                bbox_single_image.append(
                    {
                        "left": int(vehicle[0].item()),
                        "top": int(vehicle[1].item()),
                        "right": int(vehicle[2].item()),
                        "bottom": int(vehicle[3].item()),
                        "confidence": vehicle[4].item(),
                    }
                )
        bbox.append(bbox_single_image)
    return bbox


def edit_pipeline(model, image):
    boxes = ret_bbox(model, [image])

    for box in boxes[0]:
        top = int(box["top"])
        left = int(box["left"])
        right = int(box["right"])
        bottom = int(box["bottom"])
        start_point = (left, top)
        end_point = (right, bottom)
        color = (0, 0, 255)
        thickness = 2
        image = cv2.rectangle(image, start_point, end_point, color, thickness)
    return image

    # we can send multiple images inside imgs variable , box[0] returns bbox for first image , box[1] for bbox for second image and so on
    # we will pass two images frame1 and frame2 to get two bboxes
    # the box[0] is a dictionary with keys left,top,right,bottom and confidence

    # Lane finding Pipeline


def detect(opt):
    (outfile, source) = (opt.output, opt.source)
    # model = torch.hub.load("ultralytics/yolov5", "yolov5s", pretrained=True)
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # model = model.to(device)
    # Create a VideoCapture object
    cap = cv2.VideoCapture(source)

    # Check if camera opened successfully
    if cap.isOpened() == False:
        print("Unable to read camera feed")

    # Default resolutions of the frame are obtained.The default resolutions are system dependent.
    # We convert the resolutions from float to integer.
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    # Define the codec and create VideoWriter object.The output is stored in 'outpy.avi' file.
    out = cv2.VideoWriter(
        outfile[:-4] + "webm",
        cv2.VideoWriter_fourcc(*"vp80"),
        30,
        (frame_width, frame_height),
    )

    while True:
        ret, frame = cap.read()

        if ret == True:
            # frame = edit_pipeline(model, frame)
            # Write the frame into the file 'output.avi'
            frame = cv2.flip(frame, -1)
            out.write(frame)

            # Display the resulting frame
            # cv2.imshow("frame", frame)

            # Press Q on keyboard to stop recording
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        # Break the loop
        else:
            break

    # When everything done, release the video capture and video write objects
    cap.release()
    out.release()

    # Closes all the framescv2
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source", type=str, default="0", help="source"
    )  # file/folder, 0 for webcam
    parser.add_argument(
        "--output", type=str, default="inference/output", help="output folder"
    )  # output folder

    parser.add_argument(
        "--show-vid", action="store_true", help="display tracking video results"
    )
    parser.add_argument(
        "--save-vid", action="store_true", help="save video tracking results"
    )

    opt = parser.parse_args()

    with torch.no_grad():
        detect(opt)
