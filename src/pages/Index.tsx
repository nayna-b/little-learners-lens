
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EduBridgeApp from '../components/EduBridgeApp';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-50 to-green-100">
      <EduBridgeApp />
    </div>
  );
};

export default Index;
