# Brain Tumor Classification Web App

## Description

This project is a web application that predicts the type of brain tumor from an uploaded **MRI Scan image** using a deep learning (CNN) model. The backend is powered by **Flask**, and the frontend is built using **ReactJS**. The model is trained on a dataset containing different types of brain tumors, enabling accurate classification.   

Features:

- Upload an **X-ray image**.
- Get **instant prediction** of the tumor type.
- **User-friendly UI** with a simple and intuitive design.
- **Fast and accurate** classification using a trained deep learning model.
---

## How to Use

1. Open the web app.
2. Click the **Upload Image** button and select an X-ray image.
3. Click **Predict Tumor Type**.
4. The model will classify the tumor type and display the result.

![Usage Demo](./assets/Web%20Image%202.png)
![Usage Demo](./assets/Web%20Image%201.png)
---

## Technologies Used

- **Frontend:** ReactJS, Tailwind CSS
- **Backend:** Flask, Python
- **Deep Learning:** TensorFlow/Keras
---

## Dataset Used

The model was trained using a brain tumor dataset containing different tumor types. It includes:

- **Glioma Tumor**
- **Meningioma Tumor**
- **Pituitary Tumor**
- **No Tumor (Normal Brain)**