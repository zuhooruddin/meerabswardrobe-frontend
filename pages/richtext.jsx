import React, {  useEffect,useState } from 'react';
import useSWR from 'swr';

import RichTextEditor from 'components/RichTextEditor';

const HomePage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

    const titles = 'About Us'; // Set the title value here
    const fetcher = (url) => fetch(url).then((response) => response.json());
    const urls= `${apiUrl}get_dynamictext?key=${encodeURIComponent(titles)}`;
    const { data, error } = useSWR(urls, fetcher);
  
    if (error) {
      console.error('API Error:', error);
    }
  
    console.log('Response:', data);



  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');

  

  useEffect(() => {
    if (data) {
      setTitle(data[0].key);
      setPriority(data[0].priority);
      setStatus(data[0].status);
      setContent(data[0].value);
    }
  }, [data]);

 
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };
  const handleSubmit = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const plainTextContent = doc.documentElement.textContent;
  
    const data = {
      title: title,
      priority: parseInt(priority),
      status: parseInt(status),
      content: content,
    };
  
    fetch(`${apiUrl}dynamictext`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('API Response:', responseData);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  };
  


  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dynamic Text Testing</h1>
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Title:</label>
        <input type="text" id="title" style={styles.input} value={title} onChange={handleTitleChange} />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="priority" style={styles.label}>Priority:</label>
        <select id="priority" style={styles.select} value={priority} onChange={handlePriorityChange}>
          <option value="">Select Priority</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="status" style={styles.label}>Status:</label>
        <select id="status" style={styles.select} value={status} onChange={handleStatusChange}>
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="2">InActive</option>
        
        </select>
      </div>

      <RichTextEditor value={content} onChange={handleContentChange} />

      <div style={styles.preview}>
        <h2 style={styles.previewHeading}>Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default HomePage;

const styles = {
  container: {
    margin: '20px auto',
    maxWidth: '500px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  preview: {
    marginTop: '20px',
  },
  previewHeading: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  submitBtn: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
