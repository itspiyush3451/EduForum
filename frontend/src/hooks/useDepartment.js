import { useContext } from "react";
import DepartmentContext from "../context/DepartmentContext";

const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return context;
};

export default useDepartment;
