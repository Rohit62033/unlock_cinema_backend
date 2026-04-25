import { googleLoginUser, loginUser, registerUser } from "@/store/auth/authThunks"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { closeAuthModal } from "@/store/uiSlice";

const RegisterForm = ({ onLogin, onSuccess }) => {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault()
    console.log(form);

    const res = await dispatch(registerUser(form))


    if (loginUser.fulfilled.match(res)) {
      toast.success("OTP sent successfully")

      onSuccess()
    } else {
      toast.error(res.payload|| "Registration falied");
    }
  }

  const isDisabled =
    loading ||
    !form.username.trim() ||
    !form.email.trim() ||
    !form.password.trim()

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex flex-col gap-4 ">

      <div className="flex items-center justify-between ">
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold text-gray-900">Get Started</h2>
        </div>
        <button
          onClick={() => {
            dispatch(closeAuthModal())
          }}
          className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form
        className="flex flex-col w-full"
        onSubmit={handleRegister}
      >

        <input
          type="text"
          placeholder="Enter your name"
          className="border p-3 rounded-md border-gray-300 mt-6"
          onChange={(e) => setForm({
            ...form,
            username: e.target.value
          })}
        />

        <input
          type="email"
          placeholder="Enter email"
          className="border p-3 rounded-md border-gray-300 mt-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="border p-3 rounded-md border-gray-300 mt-6"
          onChange={(e) => setForm({
            ...form,
            password: e.target.value
          })}
        />
        <button
          disabled={isDisabled}
          type='submit'
          className={`flex gap-1  justify-center items-center text-white py-2.5 mt-6 rounded-md  ${isDisabled ? "bg-primary/70 cursor-not-allowed" : 'bg-primary hover:bg-primary/80 cursor-pointer'}`}
        >
          {loading ? (<Loader2 className='h-5 w-5 animate-spin' />) : ''}
          <span>Register</span>
        </button>

      </form>

      {/* Divider */}
      <div className="text-center text-sm text-slate-400">OR</div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-5 justify-center border border-gray-200 py-2 rounded hover:bg-gray-200">
        <FcGoogle /> Continue with Google
      </button>

      {/* Register */}
      <p className="text-sm text-center">
        Already have an account?{" "}
        <span
          onClick={onLogin}
          className="text-primary cursor-pointer"
        >
          Create account
        </span>
      </p>
    </div>
  )
}

export default RegisterForm