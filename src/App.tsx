import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import { Button, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import repTemplates from './templates';
import reps from './myreps.json';
import CopyToClipboard from 'react-copy-to-clipboard';

type Rep = typeof reps.reps;

function App() {

  const [zip, setZip] = useState('');
  const [zipError, setZipError] = useState(false);
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [cStep, setCStep] = useState(0);

  const goTo = (url: string) => {
    window.open(url, '_blank');
  }

  const validateForm = (): boolean => {
    let isValid = true;
    if (name === '') {
      setNameError(true);
      isValid = false;
    }
    if (city === '') {
      setCityError(true);
      isValid = false;
    }
    if (zip === '') {
      setZipError(true);
      isValid = false;
    }
    if (zip.length !== 5) {
      setZipError(true);
      isValid = false;
    }
    return isValid;
  }


  const findReps = () => {
    if (validateForm()) {
      setCStep(1);
    }
  }

  const formStep = () => {
    return (<div className="form-step">
    <p>Enter your information below to generate scripts for your governor, senators, and congressman.</p>
    <div className="zipInput">
    <Grid container spacing={3}>
    <Grid item xs={12}>
        <TextField
        id="name"
        onChange={(t) => {setNameError(false); setName(t.target.value)} }
        error={nameError}
        helperText={nameError ? 'Please enter your name' : ''}
        placeholder="Your full name" 
        label="Full Name" 
        variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
        id="city" 
        onChange={(t) => {setCityError(false); setCity(t.target.value)} }
        error={cityError}
        helperText={cityError ? 'Please enter your city' : ''}
        placeholder="Your city" 
        label="City" 
        variant="outlined" />
      </Grid>
      <Grid item xs={12}>
      <TextField 
        id="zip" 
        onChange={(t) => { setZipError(false); setZip(t.target.value)}}
        error={zipError}
        helperText={zipError ? 'Please enter a valid zip code' : ''}
        type="number"
        placeholder="Your zip code" 
        label="Zip Code" 
        variant="outlined" />
        {/* </ReactInputMask> */}
      </Grid>
    </Grid>
    </div>
    <Button variant="contained" color="primary" onClick={() => findReps()}>
      To My Reps
    </Button>
  </div>)
  }


  const formReps = (zipCode: string) => {
    return (<div className="reps">
      <Grid container justify="center" style={{maxWidth: 960}}>
      <div className="body-content" style={{ textAlign: 'left'}}>
        <h2>Instructions</h2>
      <strong>Step 1</strong>: Click "COPY SCRIPT" to copy the script for the specific representative.
      <br /><br />
      <strong>Step 2</strong>: Click "CONTACT WEBSITE" to go to representative’s contact website.
    <br /><br />
    <strong>Step 3</strong>: You will be taken to the representative’s contact website where you will paste the copied script.  If the representative’s website asks you to choose a topic, select anything similar to "Legislation Issues", "Foreign Relations", or "Foreign Affairs".
    <br /><br />
    <div className="insta-link">
        <p><i>
        For help with this website or process, please direct message <a href="https://www.instagram.com/williambgdoian/">@WilliamBgdoian</a> on Instagram. We need to work together to make this work.
        </i>
        </p>
      </div>
      </div>
      </Grid>
      <hr />
    <Grid container justify="center" style={{maxWidth: 960}}>
      {reps.reps.filter((itm) => {
      return itm.zips.find((val) => val === +zipCode) ? true : false;
    }).map((itm) => {
      // @ts-ignore
      const tmpl = repTemplates[(itm.template_id ? itm.template_id : itm.category)] || (() => '');
      const rndrd = tmpl({rep: itm.name, city, name});
    return (<Grid item xs={12}>
      <div className="rep-paper" title="Governer">
        <div className="rep-info">
          <div className="category">
            <img src={`/headshots/${itm.name.toLocaleLowerCase().replace(' ', '-')}.jpg`} width="140" alt="Gavin Newsom" />
          </div>
          <p>
            <b className="upper">{itm.category}</b>
            <br />
            {itm.name}
          </p>
          <p>
            <CopyToClipboard text={rndrd.replace(/<br \/><br \/>/g, '')}>
             <Button 
            variant="contained">
              1. Copy Script
              </Button>
          </CopyToClipboard>
          </p>
          <p>
            <Button 
            onClick={() => goTo(itm.link)}
            variant="contained">
              2. Contact Website
              </Button>
          </p>
        </div>
        <div className="rep-template">
          <div className="template-info" dangerouslySetInnerHTML={{__html: rndrd}}>
            
          </div>
        </div>
      </div>
    </Grid>)})}
    </Grid>
    <div className="insta-link insta-footer">
        For help with this website or process, please direct message <a href="https://www.instagram.com/williambgdoian/">@WilliamBgdoian</a> on Instagram. We need to work together to make this work.
        <br /><br />
        <a href="https://www.instagram.com/williambgdoian/">
        <img width="20" src='/instagram-icon.png' alt="instagram" /> @WilliamBgdoian 
        </a>
        </div>
    </div>)
  }

  const currentStep = (step: number) => {
    switch(step) {
      case 0: 
        return formStep();
      case 1:
        return formReps(zip);
      default:

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {currentStep(cStep)}
      </header>
      
    </div>
  );
}

export default App;