import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal } from "@/store/uiSlice";
import RegisterForm from "./RegisterForm";


const AuthModal = () => {

  const dispatch = useDispatch()
  const [step, setStep] = useState("login");

  const [formData, setFormData] = useState({});

  const { isAuthModalOpen } = useSelector((state) => state.ui);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center">

      <div className="bg-primary-bg w-full max-w-md rounded-xl p-6 shadow-sm mx-5">

        {step === "login" && (
          <LoginForm
            onRegister={() => setStep("register")}
            onSuccess={() => dispatch(closeAuthModal())}
          />
        )}

        {step === 'register' && (
          <RegisterForm
            onLogin={() => setStep("login")}
            onSuccess={() => dispatch(closeAuthModal())}
            />
)}


      </div>
    </div>
  );
};

export default AuthModal;