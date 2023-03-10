"use client"
import Navbar from './Navbar';
import { Inter } from '@next/font/google';
import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DiscordLogo from "./DiscordLogo";
import { Analytics } from '@vercel/analytics/react';
import { 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography ,
  Paper
  
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
interface ServerData {
  id: string;
  ServerCode: string;
  ServerName: string;
  IsActive: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
   
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'top',
    minHeight: '100vh',
    padding: theme.spacing(20),
    flexDirection: 'column',
  },
  select: {
    minWidth: 200,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    },
  
  
}));

const Home = () => {
  const classes = useStyles();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrain, setSelectedTrain] = useState('');

  const [data, setData] = useState<ServerData[]>([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://panel.simrail.eu:8084/servers-open`);
      const data = await response.json();
      setData(data.data);
    }
    fetchData();
  }, []);

  const handleChange = (event: { target: { value: any; }; }) => {
    const selectedId = event.target.value;
    router.push(`/${selectedId}`);
  };


  return (
    
    <>

    <div>
   

      <Navbar />
    </div><div className={classes.root}>

        <Typography variant="h4" className={classes.title}>Select a server</Typography>
        <FormControl className={classes.select}>
          <InputLabel id="server-select-label">Select a server</InputLabel>
          <Select
            labelId="server-select-label"
            value=""
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {data
              .filter((server) => server.IsActive === true)
              .map((server) => (
                <MenuItem key={server.id} value={server.ServerCode}>
                  {server.ServerName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Paper className={classes.footer}>
          <Typography variant="body2">
            Thanks to the SimRail devs and SimRail France for their APIs !
          </Typography>
        </Paper>
        <DiscordLogo />
        <Analytics />
      </div></>
      
  );
};

export default Home;