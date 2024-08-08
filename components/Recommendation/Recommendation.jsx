import React from 'react';
import { motion } from 'framer-motion';

const Recommendation = ({ AiResponse }) => {
  const { dates, location } = AiResponse;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-100 p-6 max-h-64 overflow-y-auto"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">Recommended Outings</h3>
      {dates.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 * (index + 1) }}
          className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <h4 className="text-lg font-semibold mb-2 text-gray-700">Outing {index + 1}</h4>
          <p className="text-gray-600 mb-1">{item.date}</p>
          <p className="text-gray-800">Location: {location[0]}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Recommendation;