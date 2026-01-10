import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const RichTextEditor = ({ value, onChange }) => {
  return (
    <DynamicReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
