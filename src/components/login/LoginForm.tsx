import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../store";
import { LoginFormContainer } from "./LoginForm.styles";

const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.auth);
    const [formValues, setFormValues] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login(formValues));
    };

    return (
        <LoginFormContainer>
            <form onSubmit={handleSubmit} className="rounded border p-8 shadow-md">
                <div className="mb-2">
                    <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <input type="password" name="password" placeholder="Password" value={formValues.password} onChange={handleChange} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Logging in..." : "Log In"}
                </button>
            </form>
        </LoginFormContainer>
    );
};

export default LoginForm;
