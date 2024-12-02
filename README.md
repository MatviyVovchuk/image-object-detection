# Object Detection Project

This project consists of two main parts:

## Backend (object-detection-api)

FastAPI-based backend service for object detection using YOLOv5.

### Setup

```bash
cd object-detection-api
python -m venv venv
venv\Scripts\activate  # On Windows
pip install fastapi uvicorn torch torchvision ultralytics
```

### Running the API

```bash
uvicorn app.main:app --reload
```

## Frontend (object-detection-ui)

React-based frontend application.

### Setup

```bash
cd object-detection-ui
npm install
```

### Running the UI

```bash
npm start
```

## Requirements

- Python 3.x
- Node.js
- npm

## Environment Variables

Create `.env` files in both directories if needed.

## Contributing

[Add your contribution guidelines here]

## License

[Add your license information here]
