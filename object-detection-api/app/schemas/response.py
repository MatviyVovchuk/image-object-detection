from pydantic import BaseModel
from typing import List, Dict, Union

class DetectedObject(BaseModel):
    label: str
    confidence: float
    xmin: float
    ymin: float
    xmax: float
    ymax: float

class DetectionResponse(BaseModel):
    objects: List[Dict[str, Union[str, float]]]  # змінили тип на більш гнучкий
    image_url: str