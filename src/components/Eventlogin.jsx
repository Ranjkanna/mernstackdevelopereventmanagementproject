import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Bgimage from "../assets/11403.jpg";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const validate = () => {
        let newErrors = {};
        if (!data.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Email is invalid";
        if (!data.password) newErrors.password = "password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const res = await axios.post("/api/login", data);

            // ✅ Flatten the response so isAdmin sits at the TOP level
            //    Backend sends: { token, user: { _id, email, isAdmin } }
            //    AuthContext needs: { _id, email, isAdmin, token }
            const flatUser = {
                ...res.data.user,
                token: res.data.token,
            };

            login(flatUser);

            setData({ email: "", password: "" });
            setErrors({});

            // ✅ SINGLE smart route — Dashboard.jsx decides Admin vs User
            navigate("/Dashboard");

        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const styles = {
        screen: {
            display: "flex",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            margin: 0,
        },
        leftSection: {
            flex: 1,
            backgroundImage: `url(${Bgimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        rightSection: {
            flex: 1,
            backgroundColor: "#004d4d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        loginCard: {
            backgroundColor: "#00c2cb",
            padding: "60px 40px 100px 40px",
            borderRadius: "0 0 80px 80px",
            width: "380px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            borderTop: "15px solid #009ca3",
            position: "relative",
        },
        inputBox: {
            backgroundColor: "rgba(0,0,0,0.15)",
            border: "none",
            borderRadius: "50px",
            marginBottom: "20px",
            padding: "5px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
        },
        loginBtn: {
            backgroundColor: "#ffb400",
            color: "white",
            border: "none",
            borderRadius: "15px",
            width: "220px",
            height: "60px",
            fontSize: "24px",
            fontWeight: "bold",
            position: "absolute",
            bottom: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            zIndex: "10",
        },
    };

    return (
        <div style={styles.screen}>
            <div style={styles.leftSection}></div>
            <div style={styles.rightSection}>
                <div className="hanging-scroll" style={styles.loginCard}>
                    <Form onSubmit={handleSubmit}>
                        <h2 className="text-white text-center mb-5" style={{ fontWeight: "300", fontFamily: "fantasy" }}>
                            JOIN THE ELITE
                        </h2>

                        <InputGroup style={styles.inputBox}>
                            <InputGroup.Text className="bg-transparent border-0 text-white">📧</InputGroup.Text>
                            <Form.Control
                                placeholder="EMAIL"
                                className="bg-transparent border-0 text-white shadow-none"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </InputGroup>

                        <InputGroup style={styles.inputBox}>
                            <InputGroup.Text className="bg-transparent border-0 text-white">🔒</InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="************"
                                className="bg-transparent border-0 text-white shadow-none"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </InputGroup>

                        <div className="d-flex justify-content-between text-white mb-4" style={{ fontSize: "13px" }}>
                            <a href="#" className="text-white text-decoration-none opacity-75">Forget password?</a>
                        </div>

                        <div className="button-roll-effect">
                            <Button type="submit" style={styles.loginBtn}>LOGIN</Button>
                        </div>
                    </Form>
                </div>
            </div>

            <style>
                {`
                input::placeholder { color: rgba(255,255,255,0.6) !important; }
                .hanging-scroll::before {
                    content: "";
                    position: absolute;
                    top: -15px;
                    left: -20px;
                    border-bottom: 15px solid #007c82; 
                    border-left: 20px solid transparent;
                    z-index: 1; 
                }
                .hanging-scroll::after {
                    content: "";
                    position: absolute;
                    top: -15px;
                    right: -20px;
                    border-bottom: 15px solid #007c82;
                    border-right: 20px solid transparent;
                    z-index: 1;
                }
                .button-roll-effect::before {
                    content: "";
                    position: absolute;
                    bottom: -38px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 200px;
                    height: 25px;
                    background: #cc8e00;
                    border-radius: 0 0 15px 15px;
                    z-index: 1;
                }
                `}
            </style>
        </div>
    );
}

export default Login;