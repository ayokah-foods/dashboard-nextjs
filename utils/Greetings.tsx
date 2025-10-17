const getCurrentGreeting = (): string => {
  const currentHour = new Date().getHours(); 
  
  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

interface GreetingsProps {
  userName: string;
}

export const Greetings: React.FC<GreetingsProps> = ({ userName }) => (
  <div className="greeting">
    <h1 className="text-start text-2xl font-bold">
      {getCurrentGreeting()} {userName}!
    </h1>
  </div>
);