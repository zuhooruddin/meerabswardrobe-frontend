// pages/increment.js
import { useState, useEffect } from 'react';

function Increment({ initialId }) {
  // Validate the initialId prop and set a default value if it's not a valid number
  const initialIdValue = !isNaN(initialId) && Number.isInteger(Number(initialId)) ? Number(initialId) : 1;
  const [id, setId] = useState(initialIdValue);

  useEffect(() => {
    const interval = setInterval(() => {
      // Check if the new ID exceeds the maximum limit (1000), and reset it if necessary
      const newId = id >= 299000 ? 1 : id + 1;

      const url = `https://www.amadox.co.uk/collectReward?id=${newId}`;
      
      // Open the URL in a new browser tab
      window.open(url, '_blank');
      
      // Update the state with the new ID
      setId(newId);
    }, 100); // Change the interval as needed (e.g., 1000 milliseconds or 1 second)

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div>
      <h1>Current ID:</h1>
      <p>{id}</p>
    </div>
  );
}

Increment.getInitialProps = async () => {
  // You can fetch the initial ID from an API or other data source here.
  // For simplicity, we're starting with an initial ID of 1.
  return { initialId: 200000 };
};

export default Increment;
