import React, { useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BgImage from "../assets/background image.jpg";

export default function Eventregister() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    let newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = "Name is required";

    if (!data.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (data.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 characters";
    }
    
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!data.password) newErrors.password = "Password is required";
    
    
    if (!agreed) newErrors.agreed = "You must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // Clear error for that specific field as user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      
      const res = await axios.post("/api/authregister", data);

      if (res.status === 200 || res.status === 201) {
        alert("Registered Successfully!");
        setData({ fullName: "", phoneNumber: "", email: "", password: "" });
        setAgreed(false);
        navigate("/Eventlogin");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      alert(msg);
    }
  };

  const styles = {
    screen: {
      display: "flex",
      height: "100vh",
      width: "100vw",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${BgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    },
    leftSide: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "80px",
      color: "white",
      position: "relative",
    },
    watermark: {
      position: "absolute",
      top: "10%",
      left: "5%",
      fontSize: "12rem",
      fontWeight: "900",
      opacity: "0.08",
      pointerEvents: "none",
      zIndex: 1,
    },
    rightSide: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    scrollCard: {
      position: "relative",
      backgroundColor: "#00c2cb",
      width: "420px",
      padding: "50px 35px 90px 35px",
      borderRadius: "0 0 80px 80px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
      borderTop: "15px solid #009ca3",
    },
    inputWrapper: {
      backgroundColor: "rgba(0,0,0,0.15)",
      borderRadius: "50px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      overflow: "hidden",
      padding: "5px",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    },
    iconCircle: {
      backgroundColor: "#39e2eb",
      height: "50px",
      width: "60px",
      borderRadius: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      marginRight: "15px",
    },
    inputField: {
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "16px",
      width: "100%",
      outline: "none",
    },
    registerBtn: {
      backgroundColor: "#ffb400",
      color: "white",
      border: "none",
      borderRadius: "15px",
      width: "240px",
      height: "65px",
      fontSize: "26px",
      fontWeight: "bold",
      position: "absolute",
      bottom: "-32px",
      left: "50%",
      transform: "translateX(-50%)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      cursor: "pointer",
      zIndex: "10",
    },
    errorText: {
      color: "#ff3333",
      fontSize: "12px",
      fontWeight: "bold",
      marginTop: "-15px",
      marginBottom: "10px",
      paddingLeft: "15px",
    },
  };

  return (
    <div style={styles.screen}>
      <div style={styles.leftSide}>
        <div style={styles.watermark}>PLAN</div>
        <div style={{ zIndex: 2 }}>
          <h1 style={{ fontSize: "4rem", fontWeight: "300" }}>Hello There,</h1>
          <p style={{ fontSize: "1.4rem", opacity: "0.9", fontStyle: "italic", maxWidth: "500px" }}>
            "A grand event is not just a date; it's a memory crafted with precision."
          </p>
          <div style={{ width: "60px", height: "4px", backgroundColor: "#ffb400", margin: "30px 0" }}></div>
          <p style={{ opacity: "0.7" }}>Start your elite journey with us.</p>
        </div>
      </div>
      <div style={styles.rightSide}>
        <div className="hanging-scroll" style={styles.scrollCard}>
          <h2 className="text-white text-center mb-5" style={{ fontWeight: "400", letterSpacing: "1px" }}>
            Request an Invite
          </h2>

          <Form onSubmit={handleSubmit}>
            {/* User Name */}
            <div style={styles.inputWrapper}>
              <div style={styles.iconCircle}>👤</div>
              <input
                style={styles.inputField}
                placeholder="USERNAME"
                name="fullName"
                value={data.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && <div style={styles.errorText}>{errors.fullName}</div>}

            {/* Phone */}
            <div style={styles.inputWrapper}>
              <div style={styles.iconCircle}>📱</div>
              <input
                style={styles.inputField}
                placeholder="PHONE NUMBER"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
              />
            </div>
            {errors.phoneNumber && <div style={styles.errorText}>{errors.phoneNumber}</div>}

            {/* Email */}
            <div style={styles.inputWrapper}>
              <div style={styles.iconCircle}>📧</div>
              <input
                style={styles.inputField}
                placeholder="EMAIL"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <div style={styles.errorText}>{errors.email}</div>}

            {/* Password */}
            <div style={styles.inputWrapper}>
              <div style={styles.iconCircle}>🔒</div>
              <input
                type="password"
                style={styles.inputField}
                placeholder="********"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <div style={styles.errorText}>{errors.password}</div>}

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="agree-checkbox"
                label={<span style={{ color: "white" }}>Agree to terms and conditions</span>}
                checked={agreed}
                onChange={(e) => {
                    setAgreed(e.target.checked);
                    if(errors.agreed) setErrors({...errors, agreed: ""});
                }}
              />
              {errors.agreed && <div style={{...styles.errorText, marginTop: "5px"}}>{errors.agreed}</div>}
            </Form.Group>

            <button type="submit" style={styles.registerBtn}>
              REGISTER
            </button>
          </Form>
          
          <p className="text-center mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
            Joined us before? <Link to="/Eventlogin" style={{ color: "white", fontWeight: "bold" }}>Login</Link>
          </p>
        </div>
      </div>

      <style>
        {`
          .hanging-scroll::before {
            content: ""; position: absolute; top: -15px; left: -25px;
            border-bottom: 15px solid #007c82; border-left: 25px solid transparent;
          }
          .hanging-scroll::after {
            content: ""; position: absolute; top: -15px; right: -25px;
            border-bottom: 15px solid #007c82; border-right: 25px solid transparent;
          }
          input::placeholder { color: rgba(255,255,255,0.7); }
        `}
      </style>
    </div>
  );
}