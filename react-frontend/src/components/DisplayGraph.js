import React, { useState, useEffect } from 'react';
import { Graph } from 'react-d3-graph';
//MATERIAL-UI
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@mui/styles';
//COMPONENTS
import Loader from './Loader';
import S3FilesAmplify from './S3FilesAmplify';
import CreateCategoryNode from './CreateCategoryNode';
//REACT-SELECT
import Select from 'react-select';
//APPSYNC-QUERIES
import { fetchGetGraphByID } from '../appsync/queries';
//APPSYNC-SUBSCRIPTIONS
import { subscribeOnGraph } from '../appsync/subscriptions';


//FOR MUI DIALOG WIDTH/HEIGHT
const useStyles = makeStyles({
	paper: {
		minWidth: "37.9vh !important",
		maxWidth: "37.9vh !important",
		minHeight: "14.1vh !important",
		maxHeight: "14.1vh !important"
	}
});


function DisplayGraph({ id }) {
	const [ref, setRef] = useState(null);


	const resetNodesPositions = React.useCallback(() => {
		if (ref) ref.resetNodesPositions();
	}, [ref]);

	const handleRefChange = React.useCallback((ref) => {
		setRef(ref);
	}, []);


	const classes = useStyles();
	const [openSelect, setOpenSelect] = useState(false);


	const [openCategoryNode_popup, setOpenCategoryNode_popup] = useState(false);


	//fetching data from APPSYNC
	const [getGraphByID, setGetGraphByID] = useState(false);
	useEffect(() => {
		const fetchFunction = async () => {
			setOpenCategoryNode_popup(false);    /* popup for that Category Node off */
			setOpenSelect(false);                /* popup list to create Node off */

			setGetGraphByID(await fetchGetGraphByID(id));
		}

        //fetching for first time
        fetchFunction();

        //'subscription' for first time
        subscribeOnGraph(fetchFunction);
	}, []);


	const [filterID, setFilterID] = useState("");


	if (getGraphByID === false) {
		return <Loader />;
	}
	else if (getGraphByID === null) {
		return <h1> Error . . . </h1>;
	}


	const config = {
		directed: true,
		automaticRearrangeAfterDropNode: true,
		collapsible: true,
		height: window.innerHeight,
		highlightDegree: 2,
		highlightOpacity: 0.2,
		linkHighlightBehavior: true,
		maxZoom: 12,
		minZoom: 0.05,
		nodeHighlightBehavior: true, // comment this to reset nodes positions to work
		panAndZoom: false,
		staticGraph: false,
		width: window.innerWidth,
		d3: {
			alphaTarget: 0.05,
			gravity: -250,
			linkLength: 120,
			linkStrength: 2
		},
		node: {
			color: '#d3d3d3',
			fontColor: 'black',
			fontSize: 10,
			fontWeight: 'normal',
			highlightColor: 'red',
			highlightFontSize: 14,
			highlightFontWeight: 'bold',
			highlightStrokeColor: 'red',
			highlightStrokeWidth: 1.5,
			labelProperty: (n) => (n.name ? `${n.id} - ${n.name}` : n.id),
			mouseCursor: 'crosshair',
			opacity: 0.9,
			renderLabel: true,
			size: 200,
			strokeColor: 'none',
			strokeWidth: 1.5,
			svg: '',
			symbolType: 'circle',
			viewGenerator: null
		},
		link: {
			color: 'lightgray',
			highlightColor: 'red',
			mouseCursor: 'pointer',
			opacity: 1,
			semanticStrokeWidth: true,
			strokeWidth: 3,
			type: 'STRAIGHT'
		}
	}


	const data = {
		links: getGraphByID.data.link,
		nodes: getGraphByID.data.node
	}


	return (
		<>
			<button
				className="btn btn-danger btn-block shadow-none"
				onClick={resetNodesPositions}
			>
				Reset
			</button>

			<IconButton onClick={() => setOpenSelect(true)} className="addBtn"> <AddIcon /> </IconButton>

			<S3FilesAmplify/>

			<div
			    className="form-group flex flex-column mt-2"
				style={{ width: "20%" }}
			>
				<Select
					options={
						getGraphByID.data.link
						.map((item) => {
							return {
								...item,
								value: `${item.source}`,
								label: `${item.source}`
							}
						})
					}
					className="basic-single w-full mt-8"
					classNamePrefix="select"
					onChange={(e) => setFilterID(e?.source)}
					isClearable={true}
				/>
			</div>

			<Graph
				id="test"
				data={data}
				config={config}
				ref={handleRefChange}
			/>

			<Dialog
				open={openSelect}
				onClose={() => setOpenSelect(false)}
				className="dialog"
				classes={{ paper: classes.paper }}
			>
				<button className="btn btn-danger btn-block shadow-none" onClick={() => setOpenCategoryNode_popup(true)} style={{ marginTop: "1rem" }}>
					CREATE CATEGORY
				</button>
			</Dialog>

			<CreateCategoryNode
				getGraphByID={getGraphByID}
				open={openCategoryNode_popup}
				setOpen={setOpenCategoryNode_popup}
			/>
		</>
	)
}


export default DisplayGraph;