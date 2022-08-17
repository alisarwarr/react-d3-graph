//AWS-AMPLIFY
import { API } from 'aws-amplify';


import {
    createGraph,
    deleteGraph,
    editGraph
} from '../../graphql/mutations';


export const handleCreateGraph = async(name) => {
    try {
        await API.graphql({
            query: createGraph,
            variables: {
                name,
                data: {
                    link: [],      /* initialize */
                    node: [        /* initialize */
                        {
                            id: name,
                            svg: "http://marvel-force-chart.surge.sh/marvel_force_chart_img/marvel.png",
                            size: 500,
                            fontSize: 18,
                            connection: `${name}`
                        }
                    ]
                }
            }
        });
    }
    catch(error) {
        console.log('error createGraph:', error);
    }
}


export const handleDeleteGraph = async(id) => {
    try {
        await API.graphql({
            query: deleteGraph,
            variables: {
                id
            }
        });
    }
    catch(error) {
        console.log('error deleteGraph:', error);
    }
}


export const handleEditGraph = async({ id, name, data }) => {
    try {
        await API.graphql({
            query: editGraph,
            variables: {
                id,
                name,
                data
            }
        });
    }
    catch(error) {
        console.log('error editGraph:', error);
    }
}