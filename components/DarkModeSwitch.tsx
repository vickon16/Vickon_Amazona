import React, { memo } from 'react'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from '@mui/material';
import { useStoreContext } from '@/store';

const DarkModeSwitch = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {state : {darkMode}, dispatch} = useStoreContext();

  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (theme === "dark" && systemTheme === "dark") {
      dispatch({ type: "DARK_MODE_ON" });
    } else {
      dispatch({type : "DARK_MODE_OFF"})
    }
     setMounted(true);
  }, [dispatch, systemTheme, theme]);


  const themeHandler = () => {
    if (mounted && currentTheme === "dark") {
      dispatch({type :"DARK_MODE_OFF"})
      setTheme("light");
    } else {
      dispatch({type :"DARK_MODE_ON"})
      setTheme("dark")
    }
  }

  return (
    <div className="mx-0 xs:mx-3 text-xl xs:text-2xl">
      <Switch
        checked={darkMode}
        onChange={themeHandler}
      />
    </div>
  );
};

export default memo(DarkModeSwitch);