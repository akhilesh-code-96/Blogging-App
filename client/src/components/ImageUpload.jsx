import React, { useState } from 'react';

const ImageUpload = ({ onImageChange }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      onImageChange(file); // Pass the file back to the parent component
    }
  };

  return (
    <div className="col-span-full">
      <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
        Photo
      </label>
      <div className="mt-2 flex items-center gap-x-3">
        <div id="photo-placeholder" className="h-12 w-12 text-gray-300">
          {image ? (
            <img src={image} alt="Uploaded" className="h-full w-full rounded-full object-cover" />
          ) : (
            <svg className="h-full w-full" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => document.getElementById('photo').click()}
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
