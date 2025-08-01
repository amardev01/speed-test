import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600">Test Component Working!</h1>
      <p className="text-lg text-gray-600 mt-4">If you can see this, React is working correctly.</p>
      <button 
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestComponent;