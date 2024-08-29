import { memo } from "react";

interface IpProps {
  ip: string;
}

const Ip = ({ ip }: IpProps) => {
  return <div style={{ padding: "20px 0" }}>Your IP is {ip}</div>;
};

export default memo(Ip);
