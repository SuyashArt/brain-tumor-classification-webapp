import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setPrediction(null);
    setDescription(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to proceed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.prediction) {
        setPrediction(response.data.prediction);
        setDescription(response.data.description);
        setError(null);
      } else if (response.data.error) {
        setError(response.data.error);
        setPrediction(null);
        setDescription(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing your request. Please try again.');
      setPrediction(null);
      setDescription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-8 rounded-xl shadow-2xl w-full max-w-2xl`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">
            🧠 Brain Tumor Classifier
          </h1>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} hover:bg-opacity-75 transition-all duration-300`}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className={`block text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-center`}>
              Upload an MRI scan to classify the type of brain tumor.
            </label>
            <div className="flex justify-center w-full">
              <label className={`cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-blue-100 text-blue-700'} px-6 py-3 rounded-xl hover:bg-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105`}>
                <span className="text-sm font-semibold">Upload Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!selectedFile || isLoading}
            className={`w-full ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white py-3 rounded-xl 
              hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105
              disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center font-semibold text-lg`}
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Analyzing...' : 'Predict Tumor Type'}
          </button>
        </form>

        {error && (
          <div className={`mt-6 p-4 ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} rounded-xl text-center text-sm`}>
            ⚠️ {error}
          </div>
        )}

        {(imagePreview || prediction) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {imagePreview && (
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden shadow-lg`}>
                <img 
                  src={imagePreview} 
                  alt="Uploaded MRI" 
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            {prediction && (
              <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} rounded-xl p-6 text-center`}>
                <h2 className={`text-2xl font-semibold ${darkMode ? 'text-blue-500' : 'text-blue-800'} mb-4`}>Prediction Result</h2>
                <p className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'} mb-4`}>{prediction}</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed mb-4`}>
                  {description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;