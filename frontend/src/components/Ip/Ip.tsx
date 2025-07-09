import { memo, useEffect } from "react";

const FETCH_API_URL = "https://api.ipify.org?format=json";

interface IpProps {
  ip: string;
  setIp: React.Dispatch<React.SetStateAction<string>>;
}

const Ip = ({ ip, setIp }: IpProps) => {
  useEffect(() => {
    fetch(FETCH_API_URL)
      .then((response) => response.json())
      .then((data) => {
        setIp(data.ip);
      });
  }, [setIp]);

  return <div style={{ padding: "20px 0" }}>Your IP is {ip}</div>;
};

export default memo(Ip);
