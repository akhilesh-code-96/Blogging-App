import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(token);
  }, [token]);

  function handleNewBlogClick() {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/new-blog");
    }
  }

  async function handleLogout() {
    window.localStorage.clear();
    await axios.get(BASE_URL + "/api/logout");
    setIsAuthenticated(isAuthenticated);
    navigate("/login");
  }

  return (
    <header className="bg-white dark:bg-gray-800 relative w-full z-50">
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10">
            The Threads
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {isAuthenticated && <Link
            to="/profile"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Profile
          </Link>}
          <Link
            to="/posts"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Feeds
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Register
            </Link>
          )}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Logout <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                >
                  Home
                </Link>
                <Link
                  to="/posts"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                >
                  Blogs
                </Link>
                <button
                  onClick={handleNewBlogClick}
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                >
                  New Blog
                </button>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                  >
                    Register
                  </Link>
                )}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-400/10"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
