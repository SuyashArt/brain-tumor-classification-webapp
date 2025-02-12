from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('brain_tumor_recognizer_model.keras')
img_height, img_width = 180, 180
class_names = ['Glioma Tumor', 'Meningioma Tumor', 'Normal Brain','Pituitary Tumor']

class_descriptions = {
    'Glioma Tumor': "Gliomas are tumors that start in the glial cells of the brain or spine. They can be malignant or benign and may cause headaches, seizures, or cognitive issues.",
    'Meningioma Tumor': "Meningiomas are tumors that arise from the meninges, the protective layers covering the brain and spinal cord. They are usually benign but can cause pressure on the brain.",
    'Pituitary Tumor': "Pituitary tumors develop in the pituitary gland and can affect hormone production. Symptoms may include vision problems, headaches, and hormonal imbalances.",
    'Normal Brain': "No tumor detected in the brain."
}

@app.route('/', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save the uploaded file temporarily
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        # Preprocess the image
        img = load_img(file_path, target_size=(img_height, img_width), color_mode='grayscale')
        img_arr = img_to_array(img)
        img_arr = tf.expand_dims(img_arr, axis=0)
        img_arr = img_arr / 255.0
        
        # Make prediction
        pred = model.predict(img_arr)
        predicted_class_index = tf.argmax(pred[0]).numpy()
        predicted_class = class_names[predicted_class_index]
        description = class_descriptions[predicted_class]
        
        # Remove the temporary file
        os.remove(file_path)
        
        return jsonify({
            'prediction': predicted_class,
            'description': description
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
