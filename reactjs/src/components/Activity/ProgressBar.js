import React, { useState, useEffect } from 'react';
import axios from "axios";
import {BASE_DEV_URL} from "../../utils/constants.js";
import { withStyles } from '@mui/styles';
import {styles} from'./styles'

const ProgressBar = (props) => {
    const {
    classes,
    done
    } = props;
	const [style, setStyle] = useState({});
	setTimeout(() => {
		const newStyle = {
			opacity: 1,
			width: `${done}%`
		}

		setStyle(newStyle);
	}, 200);

	return (
		<div className={classes.progress}>
		{done !== "0" ?
		<div className={classes.progressDone} style={style}>
        				    {done}%
        </div> : < div className={classes.noProgress}> No has registrado entrenamientos aun este mes!</div>
		}
		</div>
	)
}
export default withStyles(styles)(ProgressBar);
