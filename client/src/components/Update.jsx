import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

const UpdatePost = ({ uid, initialValues, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [input, setInput] = useState({
    category: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (initialValues) {
      setInput(initialValues);
      setCharCount(initialValues.description.length);
    }
  }, [initialValues]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setCharCount(value.length);
    setInput((prevInput) => ({
      ...prevInput,
      description: value,
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { uid, input };
    try {
      await axios.post("/api/update-blog", formData, {
        headers: { "Content-Type": "application/json" },
      });
      onSubmit(true);
    } catch (error) {
      console.error("Failed to update post", error);
      onSubmit(false);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="flex items-center text-gray-500 hover:text-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5h2a2 2 0 012 2v2h-2a2 2 0 00-2 2v2H9a2 2 0 01-2-2V7a2 2 0 012-2h2z"
          />
        </svg>
        <span className="ml-1 text-sm">Edit</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Blog Post
                  </Dialog.Title>
                  <form id="blogForm" onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={input.category}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a category</option>
                        <option value="marketing">Marketing</option>
                        <option value="finance">Finance</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="mindgame">Game</option>
                        <option value="lgbtq+">LGBTQ+</option>
                        <option value="technology">Technology</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Blog Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={input.title}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Blog Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="5"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        maxLength="2000"
                        value={input.description}
                        onChange={handleDescriptionChange}
                        required
                      ></textarea>
                      <p
                        id="charCount"
                        className="text-sm text-gray-500 text-right"
                      >
                        {charCount}/2000
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UpdatePost;
