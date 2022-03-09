import os
import sys

cdir = os.getcwd()
# cmd = (
#     "python3 pipeline.py --source ./videos/"
#     + sys.argv[1]
#     + " --output ./assets/"
#     + sys.argv[1][:-3]
#     + "avi --save-vid"
# )

cmd = "python3 track.py --source ./videos/" + sys.argv[1] + " --save-vid"

os.system(cmd)
