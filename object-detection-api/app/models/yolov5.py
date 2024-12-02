import torch
from typing import List, Dict

class YOLOv5Model:
    def __init__(self, model_path: str = "yolov5s.pt"):
        """
        Initializes the YOLOv5 model with the specified pre-trained weights.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = torch.hub.load("ultralytics/yolov5", "custom", path=model_path, force_reload=True)
        self.model.to(self.device)

    def predict(self, image_path: str) -> List[Dict]:
        """
        Performs object detection on the input image.

        Args:
            image_path (str): Path to the input image.

        Returns:
            List[Dict]: A list of detected objects with labels, confidence scores, and bounding boxes.
        """
        results = self.model(image_path)
        return results.pandas().xyxy[0].to_dict(orient="records")
