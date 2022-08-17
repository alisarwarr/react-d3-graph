import React, { useState } from 'react';
//MATERIAL-UI
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { makeStyles } from '@mui/styles';
//COMPONENTS
import Loader from './Loader';
//OPERATIONS
import { createCategoryNODE } from '../operations';


function mapNonNull(arr, cb) {
    return arr.reduce(function (accumulator, value, index, arr) {
        var result = cb.call(null, value, index, arr);
        if (result != null) {
            accumulator.push(result);
        }

        return accumulator;
    }, []);
}


//FOR MUI INPUT BORDER-RADUIS
const useStyles = makeStyles({
    root: {
        [`& fieldset`]: {
            borderRadius: 16.5
        }
    },
    paper: {
        minWidth: "66.9vh !important",
        maxWidth: "66.9vh !important",
        maxHeight: "91.6vh !important",
        minHeight: "91.6vh !important"
    }
});


function CreateCategoryNode({ getGraphByID, open, setOpen }) {
    const classes = useStyles();


    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);


    const [groupName, setGroupName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [svgIcon, setSvgIcon] = useState("");


    if (loading) {
        return <Loader />;
    }


    const availableGroupNodes = mapNonNull(
        getGraphByID
            .data
            .node
        ,
        (val) => { return val.id }
    );


    return (
        <Dialog
            open={open}
            onClose={() => { setOpen(false); /*reset*/ setGroupName(""); setCategoryName(""); setSvgIcon(""); }}
            className="dialog"
            classes={{ paper: classes.paper }}
        >
            <DialogContent>
                <form
                    className="form"
                    autoComplete="off"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setClicked(true);

                        if (groupName !== "" && svgIcon !== "" && categoryName !== "" && clicked) {
                            setLoading(true);        /* loader on */

                            //operation
                            await createCategoryNODE({
                                id: getGraphByID.id, name: getGraphByID.name, data: getGraphByID.data,
                                _groupName: groupName, _categoryName: categoryName, _svgIcon: svgIcon
                            });

                            setLoading(false);       /* loader off */

                            setGroupName("");        /* reset value */
                            setCategoryName("");     /* reset value */
                            setSvgIcon("");          /* reset value */
                            setClicked(false);
                        }
                    }}
                >
                    <Typography variant="h4" style={{ marginTop: "2.525rem", fontWeight: "bold", textAlign: "center" }}> Category Node </Typography>

                    <FormControl fullWidth>
                        <InputLabel> Group Name </InputLabel>

                        <Select
                            className={classes.root}
                            value={groupName}
                            input={<OutlinedInput label="Group Name" />}
                            onChange={(e) => setGroupName(e.target.value)}
                        >
                            {
                                availableGroupNodes
                                    .map((item, i) => <MenuItem key={i} value={item}> {item} </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    {groupName === "" && clicked && <p className="err"> Required Field </p>}

                    <div> <TextField className={classes.root} value={categoryName} onChange={(e) => setCategoryName(e.target.value)} label={<p>Category Name</p>} variant="outlined" /> </div>
                    {categoryName === "" && clicked && <p className="err"> Required Field </p>}

                    <FormControl fullWidth>
                        <InputLabel> Svg </InputLabel>

                        <Select
                            className={classes.root}
                            value={svgIcon}
                            input={<OutlinedInput label="Svg" />}
                            onChange={(e) => setSvgIcon(e.target.value)}
                        >
                            <MenuItem value="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsqs.ce9b1122.png&w=3840&q=75">
                                <img
                                    src="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsqs.ce9b1122.png&w=3840&q=75"
                                    alt=""
                                    width={30}
                                    height={30}
                                    style={{ margin: "0 auto" }}
                                />
                            </MenuItem>

                            <MenuItem value="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdynamodb.babeaadb.png&w=3840&q=75">
                                <img
                                    src="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdynamodb.babeaadb.png&w=3840&q=75"
                                    alt=""
                                    width={30}
                                    height={30}
                                    style={{ margin: "0 auto" }}
                                />
                            </MenuItem>

                            <MenuItem value="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcloudwatch.6f9f4441.png&w=3840&q=75">
                                <img
                                    src="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcloudwatch.6f9f4441.png&w=3840&q=75"
                                    alt=""
                                    width={30}
                                    height={30}
                                    style={{ margin: "0 auto" }}
                                />
                            </MenuItem>

                            <MenuItem value="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fs3.ec9c76f8.png&w=3840&q=75">
                                <img
                                    src="https://alisarwar.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fs3.ec9c76f8.png&w=3840&q=75"
                                    alt=""
                                    width={30}
                                    height={30}
                                    style={{ margin: "0 auto" }}
                                />
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {svgIcon === "" && clicked && <p className="err"> Required Field </p>}

                    <div className="form_btns">
                        <div className="form_btns_flexy" />
                        <Button className="form_btns_cancelBtn" onClick={() => { setOpen(false); /*reset*/ setGroupName(""); setCategoryName(""); setSvgIcon(""); }} disableRipple>
                            Cancel
                        </Button>
                        <Button className="form_btns_addBtn" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}


export default CreateCategoryNode;