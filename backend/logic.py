import io
import numpy as np
from sklearn.cluster import KMeans
from PIL import Image

def process_image(image_bytes, num_colors=5):
    # 1. Load and Optimize Image
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    
    # Resize for speed
    img_small = img.resize((150, 150), resample=Image.Resampling.LANCZOS)
    
    img_array = np.array(img_small)
    pixels = img_array.reshape(-1, 3)
    
    # 2. Run K-Means
    kmeans = KMeans(n_clusters=num_colors, n_init=10) # n_init is the number of times to run k-means
    kmeans.fit(pixels)
    
    # 3. Get Colors
    colors = kmeans.cluster_centers_.astype(int)
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(*c) for c in colors]
    
    # 4. Calculate Ratios
    labels = kmeans.labels_
    label_counts = np.bincount(labels)
    total_pixels = len(pixels)
    percentages = (label_counts / total_pixels) * 100
    
    # Format Result
    palette_data = []
    for i in range(len(hex_colors)):
        palette_data.append({
            "hex": hex_colors[i],
            "rgb": colors[i].tolist(),
            "percentage": round(percentages[i], 2)
        })
        
    return palette_data