import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { BounceLoader } from "react-spinners";
import type { loginTypes } from "../../types/login.types";
import { loginSchema } from "../../schema/login.schema";
import { useNavigate } from "react-router-dom";
import { AuthCreateContext } from "../../context/authContext";

export default function Login() {
  const { setAuthToken } = useContext(AuthCreateContext);
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  let nav = useNavigate();

  async function myHandelSubmit(values: loginTypes) {
    console.log(values);
    setLoading(true);

    try {
      let { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );
      console.log(data);
      toast.success(data.message);
      console.log("loading", loading);
      setAuthToken(data.data.token);
      // console.log("token", data.data.token);
      // localStorage.setItem("token", data.data.token);
      setTimeout(() => {
        nav("/home");
      }, 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        toast.danger(err.response?.data.message);
        console.log(err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex items-center">
        <div className="container display flex flex-wrap justify-around ">
          <div className="md:w-1/3">
            <h1 className="text-blue-500 my-4 text-8xl font-bold">
              Postas Route
            </h1>
            <p>
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming, web development, and application
              development. We've identified the unique challenges people may
              face when learning new technology and made efforts to provide
              strategies to overcome them.
            </p>
          </div>
          <div className="md:w-1/3">
            <form
              onSubmit={handleSubmit(myHandelSubmit)}
              className="bg-white rounded-2xl p-3  "
            >
              <div className="flex flex-col">
                <label htmlFor="Email">Email</label>
                <input
                  className="my-2 border border-gray-600 shadow rounded-2xl p-3"
                  type="email"
                  id="Email"
                  placeholder="Email"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <p className="text-red-500 bg-red-200 font-bold text-sm p-3 text-s rounded-2xl ">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  className="my-2 border border-gray-600 shadow rounded-2xl p-3"
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password")}
                />
                {formState.errors.password && (
                  <p className="text-red-500 bg-red-200 font-bold text-sm p-3 text-s rounded-2xl ">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                className="bg-sky-300 rounded-2xl m-auto cursor-pointer p-5  "
              >
                {loading ? <BounceLoader color="#36d7b7" /> : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
