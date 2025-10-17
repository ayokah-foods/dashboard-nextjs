export default interface MessageEntry {
    sender: "agent" | "customer";
    message: string;
    timestamp: string;
  }