import React from 'react';
//MATERIAL-UI
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';


//FOR MUI DIALOG WIDTH/HEIGHT
const useStyles = makeStyles({
    paper: {
        minWidth: "72.9vh !important",
        maxWidth: "72.9vh !important",
        minHeight: "57.9vh !important",
        maxHeight: "57.9vh !important",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});


function Loader() {
    const classes = useStyles();


    return (
        <Dialog
            open={true}
            className="dialog"
            classes={{ paper: classes.paper }}
        >
            <CircularProgress size={160} />
        </Dialog>
    )
}


export default Loader;