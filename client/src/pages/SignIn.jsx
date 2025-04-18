import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// redux
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess } from "../app/user/userSlice";
import { showPopup } from "../app/popup/popupSlice";
// components
import UserInputs from "../components/UserInputs";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(
        "https://market-place-jj5i.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
          // withCredentials: true, //  Axios syntax
        },
      );
      console.log(res);
      if (res.ok === false) {
        dispatch(
          showPopup({ message: "invalid user or password", type: "error" }),
        );
        return;
      }
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <UserInputs
          type="text"
          placeholder="email"
          id="email"
          formData={formData}
          setFormData={setFormData}
        />
        <UserInputs
          type="password"
          placeholder="password"
          id="password"
          formData={formData}
          setFormData={setFormData}
        />
        <button
          disabled={isLoading}
          className="cursor-pointer rounded-lg bg-slate-700 p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? (
            <svg
              aria-hidden="true"
              role="status"
              className="me-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            "Sign In"
          )}
        </button>
        <OAuth />
      </form>
      <div className="mt-5 flex gap-2">
        <p>Don't Have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
