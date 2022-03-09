# from contextlib import nullcontext
# from time import time
# import sys 
# from pathlib import Path

# file = Path(__file__).resolve()
# parent, root = file.parent, file.parents[1]
# sys.path.append(str(root))

# from AdaBins import model_io
# from AdaBins.models import UnetAdaptiveBins
# import os
# from PIL import Image
# import torchvision.transforms as transform
# import torch
# import numpy as np
# import matplotlib.image as mpimg
# import cv2
# from torchvision.transforms import ToPILImage,ToTensor


# unloader = ToPILImage()
# loader = ToTensor()  

# def image_loader(imgs,device):
#     size=640, 480
#     inter_tensor=None
#     for i,img in enumerate(imgs):
#         if (isinstance(img,np.ndarray)):
            
             
#             img=cv2.resize(img,(640,480))
#             print(img.shape)
#             img=torch.from_numpy((img/255)).to(torch.float32).permute(2,0,1)
            
#         elif (isinstance(img,str)):
#             img=loader(Image.open(img).convert('RGB').resize(size, Image.ANTIALIAS))
            
#         if inter_tensor!=None:
#             inter_tensor=torch.cat((inter_tensor,img.unsqueeze(0)),dim=0)
#         else:
#             inter_tensor=img.unsqueeze(0)
#     return inter_tensor
    
    
# def ret_depth(path,batch,model,device):
#     imgs=image_loader(batch,device)            
    
#     print(imgs[0].shape)
#     start=time()
#     _,depth=model(imgs)
#     print(depth[0].shape)
#     print(f"took {time()-start}") 

#     # if(os.path.isdir("rdepth")) :
#     #   if(path==1) : 
#     #     os.system("rm -rf rdepth")
#     #     os.mkdir('rdepth')

#     # else:
#     #   os.mkdir('rdepth')

#     # path1d=os.path.join("rdepth",str(path)+'.png')
#     # #print(depth.squeeze(0).squeeze(0).size())
#     # mpimg.imsave(path1d,depth.detach(),cmap='gray')
#     return torch.split(depth.detach(),1)

# def load_ADA(pretrained,device):
#     MIN_DEPTH = 1e-3
#     #MAX_DEPTH_NYU = 10
#     MAX_DEPTH_KITTI = 80
#     N_BINS = 256 
    
#     model = UnetAdaptiveBins.build(n_bins=N_BINS, min_val=MIN_DEPTH, max_val=MAX_DEPTH_KITTI)
#     model, _, _ = model_io.load_checkpoint(pretrained, model)
#     return model.to(device)

# # def find_depth(imgs,model):
# #     depth=ret_depth(imgs,model)
# #     # print(depth.detach().size())
# #     mpimg.imsave('./depth2.jpg',depth.detach(),cmap='gray')
# #     return depth

# if __name__=="__main__":
#     device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

#     pretrained = "./AdaBins/models/AdaBins_kitti.pt"
#     model=load_ADA(pretrained,'cpu')
#     imgs=['./AdaBins/test_imgs/1/001.jpg']

#     depth=ret_depth('1',imgs,model,'cpu') # now depth is a tuple 
#     print(depth.shape)
#     mpimg.imsave('./depth2as.jpg',depth.cpu().numpy(),cmap='gray')

    
    




from time import time
import sys
import os
sys.path.append(os.path.abspath('./AdaBins'))

import matplotlib.pyplot as plt
from AdaBins import model_io
from AdaBins.models import UnetAdaptiveBins

from PIL import Image
import torchvision.transforms as transform
import torch
import numpy as np
import matplotlib.image as mpimg
import cv2
from torchvision.transforms import ToPILImage,ToTensor
unloader = ToPILImage()
loader = ToTensor()  

def image_loader(img):
    size=640, 480
    inter_tensor=None
    if (isinstance(img,np.ndarray)):
            
        
        img=cv2.resize(img,(640,480))
    
        img=torch.from_numpy((img/255)).to(torch.float32)
        img=img.permute(2,0,1)
    elif (isinstance(img,str)):
            img=loader(Image.open(img).convert('RGB').resize(size, Image.ANTIALIAS))
            

    return img.unsqueeze(0)
    
    
def ret_depth(batch,model,device):
    imgs=image_loader(batch)            
    
    
    start=time()
    _,depth=model(imgs.to(device))
    print(f"took {time()-start}") 
    #print(depth.squeeze(0).squeeze(0).size())
    return depth.detach().squeeze(0)

def load_ADA(pretrained,device):
    MIN_DEPTH = 1e-3
    #MAX_DEPTH_NYU = 10
    MAX_DEPTH_KITTI = 80
    N_BINS = 256 
    
    model = UnetAdaptiveBins.build(n_bins=N_BINS, min_val=MIN_DEPTH, max_val=MAX_DEPTH_KITTI)
    model, _, _ = model_io.load_checkpoint(pretrained, model)
    return model.to(device)


if __name__=="__main__":
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    pretrained = "./AdaBins/models/AdaBins_kitti.pt"
    model=load_ADA(pretrained,device)
    imgs=['./AdaBins/test_imgs/1/001.jpg']

    depth=ret_depth(imgs[0],model,device) #  
    print(depth.detach().size())
    plt.axis("off")
    plt.imsave('./depth2.jpg',depth.detach(),cmap='gray')
