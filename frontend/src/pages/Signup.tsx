import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Quote } from "../components/Quote";

const Signup = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  async function sendRequest() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
        inputs
      );
      const jwt = res.data;
      console.log(jwt);

      localStorage.setItem("token", jwt);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.msg);
      } else {
        console.error("Somthing went wrong");
        alert("Unexpected error try again");
      }
    }
  }
  return (
    <div className="grid grid-cols-2">
      <div>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col w-full max-w-md">
            <div>
              <div className="text-3xl font-extrabold">Create account</div>
              Already have an account?
              <Link className="pl-2 underline" to={"/signin"}>
                Sign In
              </Link>
            </div>
            <div className="pt-8">
              <LabelledInput
                label="Email"
                placeholder="Enter Email"
                onChange={e => {
                  setInputs({
                    ...inputs,
                    email: e.target.value,
                  });
                }}
              />

              <LabelledInput
                label="First Name"
                placeholder="Enter First Name"
                onChange={e => {
                  setInputs({
                    ...inputs,
                    firstName: e.target.value,
                  });
                }}
              />
              <LabelledInput
                label="Last Name"
                placeholder="Enter Last Name"
                onChange={e => {
                  setInputs({
                    ...inputs,
                    lastName: e.target.value,
                  });
                }}
              />
              <LabelledInput
                label="Password"
                placeholder="Enter Password"
                type="password"
                onChange={e => {
                  setInputs({
                    ...inputs,
                    password: e.target.value,
                  });
                }}
              />
              <button
                onClick={sendRequest}
                type="button"
                className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        );
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default Signup;
