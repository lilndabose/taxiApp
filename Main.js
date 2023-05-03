import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser, setUserInfo } from "./slices/authSlice";
import { AuthStack, RootStack } from "./route/routes";
import Loader from "./components/Loader";
import { getVariable } from "./services/AsyncStorageMethods";

function Main() {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const userInfo = await getVariable("userInfo");
      setLoading(false);
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
      }
    }
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <RootStack userType={user.driver} />;
  }

  return <AuthStack />;
}

export default Main;
