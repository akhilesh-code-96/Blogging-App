import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdatePost from "./components/Update.jsx";
import DeletePost from "./components/Delete.jsx";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [aboutEditMode, setAboutEditMode] = useState(false);
  const [aboutText, setAboutText] = useState(""); // State to manage edited text
  const email = window.localStorage.getItem("email");

  const getAccountPosts = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/account-posts`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        const posts = response.data.blogs;
        setBlogPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        const user_data = response.data.user;
        setAboutText(user_data[0].about); // Set initial about text
        setUser(user_data);
      }
    } catch (error) {
      console.error("Error fetching the user information", error);
    }
  };

  const handleAboutEditToggle = () => {
    setAboutEditMode(!aboutEditMode);
  };

  const handleAboutChange = (event) => {
    setAboutText(event.target.value);
  };

  const handleAboutSave = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/update-about`,
        { email, about: aboutText },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setAboutEditMode(false); // Exit edit mode after save
      }
      getAccountPosts();
    } catch (error) {
      console.error("Error updating about section:", error);
    }
  };

  useEffect(() => {
    getAccountPosts();
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
        {user.map((u, i) => (
          <div className="flex items-center mb-6" key={i}>
            <div className="flex items-center justify-center">
              <img
                className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                style={{ width: "100px", height: "100px" }}
                src={u.imageUrl}
                alt="Profile"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{`${u.firstname} ${u.lastname}`}</h1>
              <p className="text-gray-600 text-lg">{u.company}</p>
              <p className="text-gray-600 text-lg">{u.role}</p>
            </div>
          </div>
        ))}
        {aboutEditMode ? (
          <div className="mt-6">
            <textarea
              className="w-full h-24 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-blue-500"
              value={aboutText}
              onChange={handleAboutChange}
              placeholder="Enter your bio..."
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                onClick={handleAboutSave}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            {user.map((u, i) => (
              <p key={i} className="text-gray-700">
                {u.about}
              </p>
            ))}
            <div className="flex justify-end mt-2">
              <button
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                onClick={handleAboutEditToggle}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        {blogPosts.length === 0 ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="space-y-8">
            {blogPosts.map((post, i) => (
              <article
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="flex items-center p-4 border-b border-gray-200">
                  <img
                    src={post.imageUrl}
                    alt={post.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold leading-6 text-blue-700">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(post.updatedAt).toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <UpdatePost
                      uid={post._id}
                      initialValues={{
                        category: post.category,
                        title: post.title,
                        description: post.description,
                      }}
                      onSubmit={getAccountPosts}
                    />
                    <DeletePost uid={post._id} onDelete={getAccountPosts} />
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-base leading-6 text-gray-700">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center p-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
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
                          d="M5 15a7 7 0 0014 0v-3a7 7 0 10-14 0v3z"
                        />
                      </svg>
                      <span className="ml-1 text-sm">Like</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
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
                          d="M8 10h.01M12 10h.01M16 10h.01M21 12.03a9.429 9.429 0 01-1.468 5.332c-.466.627-1.061 1.264-1.768 1.938-2.07 2.046-5.032 2.913-8.008 2.93-2.976.017-5.938-.887-8.008-2.93-.707-.674-1.302-1.311-1.768-1.938A9.429 9.429 0 013 12.03c0-2.24.845-4.4 2.366-6.11A11.13 11.13 0 0112 3.093a11.13 11.13 0 016.634 2.827A8.951 8.951 0 0121 12.03z"
                        />
                      </svg>
                      <span className="ml-1 text-sm">Comment</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
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
                          d="M15 10l4.553 2.276a2 2 0 010 3.448L15 18m-6-8l-4.553 2.276a2 2 0 000 3.448L9 18m0-12l6 6"
                        />
                      </svg>
                      <span className="ml-1 text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
