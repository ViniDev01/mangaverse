import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Toast from "./Toast";
import { useUser } from "../../context/useUser";

function LoginModal({ onClose, toggleForms }) {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [errorSenha, setErrorSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const { setUser } = useUser();

  const isPasswordVisible = () => setShowPassword(!showPassword);

  const validarSenha = (e) => {
    const valor = e.target.value;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regex.test(valor)) {
      setErrorSenha(
        "A senha deve ter pelo menos 8 caracteres, incluindo letras e números."
      );
    } else {
      setErrorSenha("");
    }
  };

  const validateInput = (text) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

    if (emailRegex.test(text)) {
      setInputType("email");
      setError("");
    } else if (usernameRegex.test(text)) {
      setInputType("username");
      setError("");
    } else {
      setInputType(null);
      setError("Digite um e-mail ou nome de usuário válido.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("login");
    if (saved) setInput(saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!inputType || !senha) {
      setError("Preencha todos os campos corretamente");
      setLoading(false);
      return;
    }

    if (document.getElementById("checkboxLogin").checked) {
      localStorage.setItem("login", input);
    } else {
      localStorage.removeItem("login");
    }

    try {
      let emailToUse;

      if (inputType === "email") {
        emailToUse = input;
      } else {
        // Busca o email associado ao username
        emailToUse = await getEmailFromUsername(input);
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        senha
      );
      const user = userCredential.user;
      setUser(user); // Atualiza o contexto com o usuário logado
      setToastMsg("Login realizado com sucesso!");
      setTimeout(() => {
        onClose(); // fecha o modal após 2.5 segundos
      }, 2500);
    } catch (error) {
      console.error("Erro no login:", error);

      switch (error.code || error.message) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          setError("Senha incorreta");
          break;
        case "auth/user-not-found":
        case "Username não encontrado":
          setError("Username/e-mail não cadastrado");
          break;
        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde.");
          break;
        default:
          setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar email associado ao username (você precisa implementar)
  const getEmailFromUsername = async (username) => {
    try {
      const db = getFirestore();
      const usernameDoc = await getDoc(doc(db, "usernames", username));

      if (!usernameDoc.exists()) {
        throw new Error("Username não encontrado");
      }

      return usernameDoc.data().email;
    } catch (error) {
      console.error("Erro ao buscar username:", error);
      throw error; // Propaga o erro para ser tratado no handleSubmit
    }
  };

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
      <h1>Login</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        <i className="fa-solid fa-times close-form" onClick={onClose}></i>
        <div className="box-input">
          <span>Nome de usuário ou e-mail*</span>
          <input
            type="text"
            name="username"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              validateInput(e.target.value);
            }}
            autoComplete="username email"
            title="Digite um e-mail válido ou um nome de usuário (3 a 16 caracteres)"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div className="box-input">
          <span>Senha*</span>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={validarSenha}
              autoComplete="current-password"
              title="A senha deve ter pelo menos 8 caracteres, incluindo letras e números."
              required
            />
            <button
              type="button"
              onClick={isPasswordVisible}
              className="password-toggle"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {errorSenha && <p style={{ color: "red" }}>{errorSenha}</p>}
        </div>

        <div className="enviar">
          <div className="checkbox-lbs">
            <input type="checkbox" name="checkbox" id="checkboxLogin" />
            <span>Lembrar-se</span>
          </div>
          <button type="submit" disabled={loading} className="input-logar">
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>
        <div className="box-ajuda">
          <a href="#">Esqueceu da sua senha?</a>
          <span onClick={toggleForms}>Criar conta</span>
        </div>
      </form>
    </>
  );
}

export default LoginModal;
