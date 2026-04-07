import { useEffect, useMemo, useState } from "react";
import { Leaf, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { ButtonGroup } from "../ui/button-group";

type ResolvedTheme = "light" | "dark" | "green";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

const getResolvedTheme = (
  theme: "light" | "dark" | "green" | "system"
): ResolvedTheme => {
  if (theme === "light" || theme === "dark" || theme === "green") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const UserInfo = ({ children }: Props) => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  // system 테마일 때 OS 테마 변화도 반영하고 싶어서, resolved theme를 state로 관리
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    getResolvedTheme(theme)
  );

  const changeLanguage = (lng: "ko" | "en") => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const init = () => setResolved(getResolvedTheme(theme));
    init();

    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(getResolvedTheme("system"));

    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [theme]);

  const themeIcon = useMemo(() => {
    switch (resolved) {
      case "dark":
        return { icon: <Sun size={16} />, label: "Light mode" };
      case "light":
        return { icon: <Leaf size={16} />, label: "Green mode" };
      case "green":
        return { icon: <Moon size={16} />, label: "Dark mode" };
    }
  }, [resolved]);

  const toggleTheme = () => {
    // light -> green -> dark 순서로 순환
    const nextMap: Record<ResolvedTheme, "light" | "dark" | "green"> = {
      light: "green",
      green: "dark",
      dark: "light",
    };
    setTheme(nextMap[resolved]);
  };
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {t("home.language", "Language")}:
        </span>
        <ButtonGroup>
          <Button
            size="sm"
            variant={i18n.language === "ko" ? "default" : "outline"}
            onClick={() => changeLanguage("ko")}
          >
            한국어
          </Button>
          <Button
            size="sm"
            variant={i18n.language === "en" ? "default" : "outline"}
            onClick={() => changeLanguage("en")}
          >
            English
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" type="button" onClick={toggleTheme} variant="outline">
          {themeIcon.icon}
          <span className="hidden sm:inline">{themeIcon.label}</span>
        </Button>
        {children && Array.isArray(children) ? (
          children?.length > 0 ? (
            children.map((child) => child)
          ) : (
            <></>
          )
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default UserInfo;
