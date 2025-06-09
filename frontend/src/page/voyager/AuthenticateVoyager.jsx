import React, { useEffect, useState } from "react";
import api from "../../services/axiosInstance";
import { Navigate, Outlet } from "react-router-dom";

function AuthenticateVoyager() {
  const voyagerId = localStorage.getItem("voyagerId");
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const getVoyager = async () => {
      try {
        const response = await api.post(
          `/voyager/auth/getDetails?voyagerId=${voyagerId}`
        );
        if (response.data.success) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.log("error in AuthenticateUser", error);
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (voyagerId) {
      getVoyager();
    } else {
      setIsLoading(false);
    }
  }, [voyagerId]);

  if (isLoading) return null;

  return userExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthenticateVoyager;
