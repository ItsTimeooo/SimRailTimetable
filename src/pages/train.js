import { useRouter } from 'next/router';
import { useState } from "react"
import Navbar from '../app/Navbar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Grid,Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles,Typography} from '@material-ui/core';
import DiscordLogo from "../app/DiscordLogo";
import Head from 'next/head'
import React, {  useEffect } from "react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const useStyles = makeStyles((theme) => ({
  root: {
  
  
   
   
    padding: theme.spacing(10),
   
  },
  footer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    }
}));
const Server = () => {

  const router = useRouter();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const { id } = router.query;
  const currentDateTime = new Date().toLocaleString(); 
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    async function fetchData() {
      if(!router.isReady) return;
      const { id } = router.query;
      const response = await fetch(`https://staging.simrail.deadlykungfu.ninja/train/${id}`);
      const data = await response.json();
      const promises = [];
      data.forEach(async (station) => {
        
      });
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(intervalId),
    

    Promise.all(promises)
    .then(() => {
      setData(data);
      setIsLoaded(true);
      
    })
    .catch((error) => {
      console.error(error);
    });
  }
  fetchData();
}, [router.isReady]);

  if (!isLoaded) {
    return <div>
      
      Loading data... Please Wait</div>;
    }


    //
    
  const generatePDF = () => {
   
    const trainTypes = data.map(station => station.train_type);
    const uniqueTrainTypes = [...new Set(trainTypes)];
    const docDefinition = {
      content: [
        {
          text: `Train ${id} Information : `,
          style: 'header'
        },
        {
          text: `Train type : ${uniqueTrainTypes.join(', ')}`,
          style: 'header'
        },
      
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              ['Station Name', 'Arrival Time', 'Departure Time', 'Stop Type','Layover Time','Line'],
              ...data.map(station => [station.station, station.scheduled_arrival_hour, station.scheduled_departure_hour, station.stop_type,station.layover,station.line])
            ],
            footer: {
              columns: [
                'Left part',
                { text: 'Right part', alignment: 'right' }
              ]
            },
          }
        }
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        table: {  
          margin: [0, 10, 0, 10]
        }
      },
      footer: function() {
        return {
          text: `Generated for simulation use only - ${currentDateTime}`,
          alignment: 'center',
          fontSize: 8
        };
      }
    };
    
    pdfMake.createPdf(docDefinition).download(`${id} Timetable.pdf`);
  }

  const redirectToMenu = (event) => {
    const { server } = router.query;
    router.push(`/${server}`);
    
  }

  return (
    <><div> <Navbar /></div>
    
  
    
    <div className={classes.root}>
        
      <Head><title>SimRail Timetable</title>
      <link rel="shortcut icon" href="/logo_64.png" type="image/x-icon" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="A simple timetable for SimRail" />
      </Head>

      {isLoaded && (
        <div>
          <Grid container spacing={0} alignItems="flex-start">
            <Button variant="contained" color="secondary" size="medium" onClick={redirectToMenu}>Come back to the train selection</Button>
          </Grid>
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Button variant="contained" color="primary" size="medium" onClick={generatePDF}>Download timetable for {id}</Button>

            <Grid container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xs={8}>
              <Typography variant="h6">If there is no data available, please check again in a few minutes.</Typography>
               
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={8}>
              <TableContainer component={Paper} style={{ maxHeight: '650px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Station Name</b></TableCell>
                      <TableCell><b>Arrival Time</b></TableCell>
                      <TableCell><b>Departure Time</b></TableCell>
                      <TableCell><b>Stop Type</b></TableCell>
                      <TableCell><b>Layover Time</b></TableCell>
                      <TableCell><b>Line</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(station => (
                      <TableRow key={station.station}>

                        <TableCell>{station.station}</TableCell>
                        <TableCell>{station.scheduled_arrival_hour}</TableCell>
                        <TableCell>{station.scheduled_departure_hour}</TableCell>
                        <TableCell>{station.stop_type}</TableCell>
                        <TableCell>{station.layover}</TableCell>
                        <TableCell>{station.line}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Paper className={classes.footer}>
            <Typography variant="body2">
            Thanks to the SimRail devs and SimRail France for their API !
            </Typography>
          </Paper>
          <DiscordLogo />
        </div>
      )}
    </div></>
  );
};


export default Server;
