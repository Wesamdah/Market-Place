import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  currentUserStart,
  currentUserSuccess,
  currentUserFailure,
} from "../app/user/userSlice";
import { showPopup } from "../app/popup/popupSlice";
// components
import UserInputs from "../components/UserInputs";
import OAuth from "../components/OAuth";
import figure from "../assets/imgs/figure.png";
import bubles from "../assets/imgs/bubles.png";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        dispatch(
          showPopup({ message: "Invalid email or password", type: "error" }),
        );
        dispatch(signInFailure());
        return;
      }

      const loginData = await res.json();
      dispatch(signInSuccess(loginData));

      // Fetching the actual current user from the backend after signing in (based on the cookie)
      dispatch(currentUserStart());
      const userRes = await fetch("/api/user/getCurrentUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!userRes.ok) {
        dispatch(currentUserFailure("Failed to get user data"));
        return;
      }

      const userData = await userRes.json();
      dispatch(currentUserSuccess(userData));

      navigate("/");
    } catch (error) {
      dispatch(showPopup({ message: error.message, type: "error" }));
      dispatch(signInFailure());
    }
  };

  return (
    <div className="relative flex h-[calc(100vh_-_72px)] flex-col gap-[150px] p-12 lg:flex-row lg:justify-between lg:gap-0">
      <div className="fixed top-[72px] left-0 -z-1 ml-0">
        <img src={bubles} alt="" />
      </div>
      <div className="flex flex-col lg:h-full lg:w-[25%] lg:justify-center">
        <h1 className="animate-shapeFade-out text-4xl font-semibold text-slate-800 opacity-0 md:text-2xl lg:text-4xl">
          Market Place
        </h1>
        <p
          className="animate-shapeFade-out mt-8 text-2xl font-bold text-slate-700 opacity-0"
          style={{ animationDelay: "200ms" }}
        >
          Sign In to <br />
          Reachage Direct
        </p>
        <p
          className="animate-shapeFade-out mt-8 text-xl font-normal text-slate-700 opacity-0 md:text-lg lg:text-xl"
          style={{ animationDelay: "300ms" }}
        >
          If you don’t have an account
          <br /> You can
          <Link to={"/signup"} className="text-xl font-normal text-blue-400">
            <span> Sign Up</span>
          </Link>
        </p>
      </div>
      <div
        className="animate-shapeFade-out absolute top-[30px] right-0 -z-1 h-80 w-80 opacity-0 md:right-[200px] lg:static lg:flex lg:h-full lg:w-[30%] lg:items-center lg:justify-center"
        style={{ animationDelay: "500ms" }}
      >
        <img src={figure} alt="" className="object-contain" />
      </div>
      <div className="flex w-full lg:mt-3 lg:h-full lg:w-[35%] lg:items-center">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
          <UserInputs
            type="text"
            placeholder="Email"
            id="email"
            formData={formData}
            setFormData={setFormData}
          />
          <UserInputs
            type="password"
            placeholder="Password"
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
          <div className="relative flex justify-center before:absolute before:top-1/2 before:left-1/2 before:-z-1 before:h-[1px] before:w-full before:-translate-1/2 before:bg-[#777]">
            <p className="z-10 w-fit bg-[#f1f5f1] p-2 text-[#777]">
              Or Continue with
            </p>
          </div>
          <OAuth />
        </form>
      </div>
    </div>
  );
}
