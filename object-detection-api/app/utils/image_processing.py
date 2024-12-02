from PIL import Image, ImageDraw, ImageFont
import os

def save_uploaded_file(uploaded_file, destination: str):
    """
    Saves an uploaded file to the specified destination.
    """
    with open(destination, "wb") as f:
        f.write(uploaded_file.file.read())

def resize_image(image_path: str, max_size: int = 640):
    """
    Resizes the image to the specified maximum size.
    """
    img = Image.open(image_path)
    img.thumbnail((max_size, max_size))
    img.save(image_path)

def draw_predictions(image_path: str, output_path: str, predictions: list):
    """
    Draws bounding boxes and labels on the image based on predictions.

    Args:
        image_path (str): Path to the input image.
        output_path (str): Path to save the annotated image.
        predictions (list): List of predictions with bounding box info and labels.
    """
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    # Load a default font
    font = ImageFont.load_default()

    for obj in predictions:
        # Bounding box coordinates
        xmin, ymin, xmax, ymax = obj["xmin"], obj["ymin"], obj["xmax"], obj["ymax"]
        label = f"{obj['name']} ({obj['confidence']:.2f})"

        # Draw rectangle and label
        draw.rectangle([xmin, ymin, xmax, ymax], outline="red", width=3)
        draw.text((xmin, ymin - 10), label, fill="red", font=font)

    img.save(output_path)
