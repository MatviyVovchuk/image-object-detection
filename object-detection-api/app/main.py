from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Додаємо імпорт
from app.models.yolov5 import YOLOv5Model
from app.utils.image_processing import save_uploaded_file, resize_image, draw_predictions
from app.schemas.response import DetectionResponse, DetectedObject
from typing import List
import os
from pathlib import Path

app = FastAPI()

# Створюємо директорію для тимчасових файлів, якщо вона не існує
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

# Монтуємо статичну директорію
app.mount("/temp", StaticFiles(directory="temp"), name="temp")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

yolo_model = YOLOv5Model()

@app.post("/predict", response_model=DetectionResponse)
async def predict_objects(file: UploadFile = File(...)):
    # Генеруємо унікальне ім'я файлу
    file_extension = Path(file.filename).suffix
    base_filename = f"image_{os.urandom(8).hex()}{file_extension}"
    file_path = TEMP_DIR / base_filename
    
    # Зберігаємо завантажений файл
    save_uploaded_file(file, str(file_path))
    
    # Обробляємо зображення
    resize_image(str(file_path))
    results = yolo_model.predict(str(file_path))
    
    # Створюємо список об'єктів
    objects = []
    for obj in results:
        detected_obj = DetectedObject(
            label=obj["name"],
            confidence=float(obj["confidence"]),
            xmin=float(obj["xmin"]),
            ymin=float(obj["ymin"]),
            xmax=float(obj["xmax"]),
            ymax=float(obj["ymax"])
        )
        objects.append(detected_obj.dict())

    # Створюємо анотоване зображення
    annotated_filename = f"annotated_{base_filename}"
    annotated_path = TEMP_DIR / annotated_filename
    draw_predictions(str(file_path), str(annotated_path), results)

    # Формуємо URL для отримання зображення
    image_url = f"/temp/{annotated_filename}"

    return DetectionResponse(
        objects=objects,
        image_url=image_url
    )

@app.get("/image/{filename}")
async def get_annotated_image(filename: str):
    file_path = TEMP_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(str(file_path))

# Додаємо обробник для очищення тимчасових файлів
@app.on_event("startup")
async def startup_event():
    # Очищаємо тимчасову директорію при запуску
    for file in TEMP_DIR.glob("*"):
        try:
            file.unlink()
        except Exception as e:
            print(f"Error deleting {file}: {e}")