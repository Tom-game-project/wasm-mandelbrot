from PIL import Image
import matplotlib.pyplot as plt
import numpy as np


with Image.open(r"image\thumbnail.png") as f:
    img=f.resize((60,60))
    img.save("image/thumbnail(60x60).png")

