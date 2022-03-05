import os
import sys

cdir = os.getcwd()
cmd = (
    "python3 pipeline.py --source ./videos/"
    + sys.argv[1]
    + " --output ./assets/"
    + sys.argv[1][:-3]
    + ".avi --save-vid"
)
# cmd = "python3 pipeline.py --source ./videos/a2.mp4 --output ./assets/a2.mp4 --save-vid"
print(cmd)
# cmd1 = (
#     "ffmpeg -i ./assets/"
#     + sys.argv[1][:-4]
#     + "mp4 ./assets/"
#     + sys.argv[1][:-4]
#     + "mp4"
# )

os.system(cmd)
# os.system(cmd1)
