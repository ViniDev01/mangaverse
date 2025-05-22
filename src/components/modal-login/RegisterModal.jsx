import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { doc, getFirestore, getDoc, writeBatch } from "firebase/firestore";

function RegisterModal({ onClose, toggleForms }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({
    available: null,
    checking: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Verifica disponibilidade do username em tempo real
  useEffect(() => {
    const checkUsername = async () => {
      if (nickname.length >= 3 && nickname.length <= 16) {
        setUsernameStatus({ available: null, checking: true });
        try {
          const usernameRef = doc(
            getFirestore(),
            "usernames",
            nickname.toLowerCase()
          );
          const usernameSnap = await getDoc(usernameRef);

          setUsernameStatus({
            available: !usernameSnap.exists(),
            checking: false,
          });
        } catch (error) {
          console.error("Erro ao verificar username:", error);
          setUsernameStatus({ available: null, checking: false });
        }
      } else {
        setUsernameStatus({ available: null, checking: false });
      }
    };

    const timer = setTimeout(() => {
      if (nickname) checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [nickname]);

  const validarFormulario = () => {
    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      return false;
    }

    if (nickname.length < 3 || nickname.length > 16) {
      setError("Nickname deve ter entre 3 e 16 caracteres");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
      setError("Nickname só pode conter letras, números e underline");
      return false;
    }

    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return false;
    }

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem");
      return false;
    }

    if (usernameStatus.checking) {
      setError("Aguarde a verificação do nickname");
      return false;
    }

    if (usernameStatus.available === false) {
      setError("Este nickname já está em uso");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();

      // Verificação final do nickname
      const usernameDoc = await getDoc(
        doc(db, "usernames", nickname.toLowerCase())
      );
      if (usernameDoc.exists()) {
        throw new Error("Este nickname já está em uso");
      }

      // 1. Cria usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      // 2. Atualiza o perfil (NOVO MÉTODO MAIS ROBUSTO)
      await updateProfile(userCredential.user, {
        // Usar userCredential.user diretamente
        displayName: nickname,
        photoURL:
          "https://archive.org/download/default_profile/default-avatar.png", // URL padrão para o avatar
      });

      // 3. Força atualização imediata (CRÍTICO)
      await userCredential.user.reload();
      console.log("DEBUG - Nickname salvo:", userCredential.user.displayName);

      // 4. Armazena dados no Firestore (TRANSACTION PARA EVITAR RACE CONDITIONS)
      const batch = writeBatch(db);

      // a) Registra o nickname como único
      batch.set(doc(db, "usernames", nickname.toLowerCase()), {
        email: email,
        userId: userCredential.user.uid,
        createdAt: new Date(),
      });

      // b) Cria documento do usuário
      batch.set(doc(db, "users", userCredential.user.uid), {
        nickname: nickname,
        email: email,
        createdAt: new Date(),
        lastLogin: new Date(),
        profileComplete: false,
      });

      await batch.commit();

      // Feedback visual
      setError("✅ Cadastro realizado com sucesso!");
      setTimeout(() => {
        resetForm();
        onClose();
        window.location.reload(); // Garante atualização do contexto
      }, 1500);
    } catch (error) {
      console.error("Erro detalhado:", error);

      // Tratamento de erros específicos
      let errorMessage = "Erro no cadastro";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este e-mail já está cadastrado";
          break;
        case "auth/weak-password":
          errorMessage = "A senha deve ter 8+ caracteres com letras e números";
          break;
        case "auth/invalid-email":
          errorMessage = "Formato de e-mail inválido";
          break;
        case "permission-denied":
          errorMessage = "Sem permissão para registrar";
          break;
        default:
          if (error.message.includes("nickname")) {
            errorMessage = error.message;
          }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setNickname("");
    setSenha("");
    setConfirmSenha("");
    setError("");
    setUsernameStatus({ available: null, checking: false });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <h1>Registrar-se</h1>
      {error && (
        <div
          className="error-message"
          style={{
            color: error.startsWith("✅") ? "green" : "red",
            margin: "10px 0",
          }}
        >
          {error}
        </div>
      )}

      <form className="formulario" onSubmit={handleRegister}>
        <i className="fa-solid fa-times close-form" onClick={handleClose}></i>

        <div className="box-input">
          <span>Email*</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="seu@email.com"
          />
        </div>

        <div className="box-input">
          <span>Nickname*</span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            minLength="3"
            maxLength="16"
            autoComplete="username"
            required
            placeholder="seu_nickname"
          />
          {nickname && (
            <div
              style={{
                color: usernameStatus.checking
                  ? "gray"
                  : usernameStatus.available === true
                  ? "green"
                  : usernameStatus.available === false
                  ? "red"
                  : "gray",
                fontSize: "0.8rem",
                marginTop: "5px",
              }}
            >
              {usernameStatus.checking
                ? "Verificando..."
                : usernameStatus.available === true
                ? "✓ Disponível"
                : usernameStatus.available === false
                ? "✗ Já em uso"
                : ""}
            </div>
          )}
        </div>

        <div className="box-input">
          <span>Senha*</span>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "gray" }}>
            Mínimo 8 caracteres com letras e números
          </div>
        </div>

        <div className="box-input">
          <span>Repita sua senha*</span>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="enviar">
          <div className="checkbox-lbs">
            <p className="back" onClick={toggleForms}>
              Já tem conta? <span>Faça login</span>
            </p>
          </div>
          <button
            type="submit"
            className="input-logar"
            disabled={loading || usernameStatus.checking}
            aria-busy={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </>
  );
}

export default RegisterModal;
