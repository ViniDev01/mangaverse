
import { useContext } from "react";
import { UserContext } from "./UserContext"; // ajuste o caminho se necessário

export const useUser = () => useContext(UserContext);
