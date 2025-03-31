import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';


export default function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Force a re-render every second
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [setDate]);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return (
    <div>
      <h1>Clock</h1>
      <Typography variant="h4" color="text.secondary" align="center"
      >{`${hours}:${minutes}:${seconds}`}</Typography>
    </div>
  );
}
